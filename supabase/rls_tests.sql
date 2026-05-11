-- ============================================================
-- RLS TESTS - Questlog
-- Ejecuta TODO el archivo (boton Run)
-- Resultados en la pestana Results del SQL Editor
-- ============================================================

CREATE TEMP TABLE IF NOT EXISTS _rls_results (
  ord    SERIAL,
  status TEXT NOT NULL,
  test   TEXT NOT NULL,
  detail TEXT
);
TRUNCATE _rls_results;

DO $$
DECLARE
  v_gm       CONSTANT TEXT := 'user_3D4aj6ASgGnwg9CxGkyFYr86lgT';
  v_player   CONSTANT TEXT := 'user_3D4cDnVHmp3nlBYVTUhK2oqy1wd';
  v_stranger CONSTANT TEXT := 'user_3DOzjOSDfw0q8MfPFeRJhNic1F6';
  v_gm_id     TEXT;
  v_player_id TEXT;
  v_n   INTEGER := 0;
  v_ok  BOOLEAN := false;
  v_msg TEXT    := '';
BEGIN

  -- Resolver IDs como superusuario (antes de activar RLS)
  SELECT id INTO v_gm_id     FROM "User" WHERE "clerkId" = v_gm;
  SELECT id INTO v_player_id FROM "User" WHERE "clerkId" = v_player;

  IF v_gm_id IS NULL THEN
    INSERT INTO _rls_results(status, test, detail)
    VALUES ('SETUP', 'GM no encontrado en BD', 'clerkId buscado: ' || v_gm);
    RETURN;
  END IF;

  -- Patron empleado:
  --   EXECUTE 'SET LOCAL ROLE authenticated' + set_config -> activa RLS
  --   EXECUTE 'RESET ROLE'                               -> vuelve a postgres
  --   INSERT en _rls_results siempre como postgres (sin restricciones)
  --   Las escrituras usan BEGIN/EXCEPTION con RAISE '__rb__' para hacer rollback
  --   sin perder el resultado capturado en v_n / v_ok

  -- ============================================================
  -- CAMPAIGN - SELECT
  -- ============================================================

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  SELECT COUNT(*) INTO v_n FROM "Campaign" WHERE "isPublic" = false;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES ('INFO', 'Campaign SELECT - GM (privadas visibles)', v_n || ' privadas');

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  SELECT COUNT(*) INTO v_n FROM "Campaign";
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES ('INFO', 'Campaign SELECT - PLAYER (total visible)', v_n || ' campanas');

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_stranger, true);
  SELECT COUNT(*) INTO v_n FROM "Campaign" WHERE "isPublic" = false;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 0 THEN 'PASS' ELSE 'FAIL' END,
    'Campaign SELECT - EXTRANO no ve privadas (esperado: 0)',
    'Privadas visibles: ' || v_n
  );

  -- ============================================================
  -- CAMPAIGN - INSERT
  -- ============================================================

  -- GM: debe poder insertar
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  v_ok := false; v_msg := '';
  BEGIN
    INSERT INTO "Campaign"(id, name, "gameMasterId", "isPublic", "updatedAt")
    VALUES (gen_random_uuid()::text, '_test_insert', v_gm_id, false, now());
    v_ok := true; v_msg := 'Inserto OK (rolled back)';
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_ok := false; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (CASE WHEN v_ok THEN 'PASS' ELSE 'FAIL' END, 'Campaign INSERT - GM (debe poder)', v_msg);

  -- PLAYER: NO debe poder insertar con gameMasterId ajeno
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  v_ok := false; v_msg := 'Inserto sin error (no debia)';
  BEGIN
    INSERT INTO "Campaign"(id, name, "gameMasterId", "isPublic", "updatedAt")
    VALUES (gen_random_uuid()::text, '_test_trampa', v_gm_id, false, now());
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_ok := true; v_msg := 'Bloqueado: ' || SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (CASE WHEN v_ok THEN 'PASS' ELSE 'FAIL' END, 'Campaign INSERT - PLAYER gameMasterId ajeno (debe fallar)', v_msg);

  -- ============================================================
  -- CAMPAIGN - UPDATE
  -- ============================================================

  -- GM: debe actualizar >0 filas
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  v_n := 0; v_msg := '';
  BEGIN
    UPDATE "Campaign" SET name = '_test_update' WHERE "gameMasterId" = v_gm_id;
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n > 0 THEN 'PASS' WHEN v_n = 0 THEN 'SIN DATOS' ELSE 'FAIL' END,
    'Campaign UPDATE - GM (debe actualizar >0 filas)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

  -- PLAYER: debe obtener 0 filas (RLS filtra)
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  v_n := 0; v_msg := '';
  BEGIN
    UPDATE "Campaign" SET name = '_test_hackeo'
    WHERE id = (SELECT id FROM "Campaign" LIMIT 1);
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 0 THEN 'PASS' WHEN v_n > 0 THEN 'FAIL' ELSE 'ERROR' END,
    'Campaign UPDATE - PLAYER (debe ser 0 filas)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

  -- ============================================================
  -- CAMPAIGN - DELETE
  -- ============================================================

  -- GM: debe borrar >0 filas
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  v_n := 0; v_msg := '';
  BEGIN
    DELETE FROM "Campaign" WHERE "gameMasterId" = v_gm_id;
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n > 0 THEN 'PASS' WHEN v_n = 0 THEN 'SIN DATOS' ELSE 'FAIL' END,
    'Campaign DELETE - GM (debe borrar >0 filas)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

  -- PLAYER: debe obtener 0 filas (RLS filtra)
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  v_n := 0; v_msg := '';
  BEGIN
    DELETE FROM "Campaign" WHERE id = (SELECT id FROM "Campaign" LIMIT 1);
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 0 THEN 'PASS' WHEN v_n > 0 THEN 'FAIL' ELSE 'ERROR' END,
    'Campaign DELETE - PLAYER (debe ser 0 filas)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

  -- ============================================================
  -- MEMBERSHIP - SELECT
  -- ============================================================

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  SELECT COUNT(*) INTO v_n FROM "Membership";
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES ('INFO', 'Membership SELECT - PLAYER', v_n || ' membresia(s)');

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  SELECT COUNT(*) INTO v_n FROM "Membership";
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES ('INFO', 'Membership SELECT - GM', v_n || ' membresia(s)');

  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_stranger, true);
  SELECT COUNT(*) INTO v_n FROM "Membership";
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 0 THEN 'PASS' ELSE 'FAIL' END,
    'Membership SELECT - EXTRANO (debe ver 0)',
    v_n || ' membresia(s)'
  );

  -- ============================================================
  -- MEMBERSHIP - INSERT
  -- ============================================================

  -- GM: debe poder insertar
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  v_ok := false; v_msg := '';
  BEGIN
    INSERT INTO "Membership"(id, "userId", "campaignId", role, "updatedAt")
    VALUES (
      gen_random_uuid()::text, v_player_id,
      (SELECT id FROM "Campaign" WHERE "gameMasterId" = v_gm_id LIMIT 1),
      'PLAYER', now()
    );
    v_ok := true; v_msg := 'Inserto OK (rolled back)';
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_ok := false; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (CASE WHEN v_ok THEN 'PASS' ELSE 'FAIL' END, 'Membership INSERT - GM (debe poder)', v_msg);

  -- PLAYER: NO debe poder insertar
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  v_ok := false; v_msg := 'Inserto sin error (no debia)';
  BEGIN
    INSERT INTO "Membership"(id, "userId", "campaignId", role, "updatedAt")
    VALUES (
      gen_random_uuid()::text, v_gm_id,
      (SELECT id FROM "Campaign" LIMIT 1),
      'EDITOR', now()
    );
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_ok := true; v_msg := 'Bloqueado: ' || SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (CASE WHEN v_ok THEN 'PASS' ELSE 'FAIL' END, 'Membership INSERT - PLAYER (debe fallar)', v_msg);

  -- ============================================================
  -- USER - SELECT / UPDATE
  -- ============================================================

  -- GM: ve solo 1 usuario (el suyo)
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  SELECT COUNT(*) INTO v_n FROM "User";
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 1 THEN 'PASS' ELSE 'FAIL' END,
    'User SELECT - GM (debe ver solo 1)',
    v_n || ' usuario(s) visible(s)'
  );

  -- GM: puede actualizar su propio registro
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_gm, true);
  v_n := 0; v_msg := '';
  BEGIN
    UPDATE "User" SET name = '_test_update' WHERE "clerkId" = v_gm;
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 1 THEN 'PASS' ELSE 'FAIL' END,
    'User UPDATE - GM propio (debe ser 1 fila)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

  -- PLAYER: NO puede actualizar el registro del GM
  EXECUTE 'SET LOCAL ROLE authenticated';
  PERFORM set_config('app.current_user_id', v_player, true);
  v_n := 0; v_msg := '';
  BEGIN
    UPDATE "User" SET name = '_test_hackeo' WHERE "clerkId" = v_gm;
    GET DIAGNOSTICS v_n = ROW_COUNT;
    RAISE EXCEPTION '__rb__';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM <> '__rb__' THEN v_n := -1; v_msg := SQLERRM; END IF;
  END;
  EXECUTE 'RESET ROLE';
  INSERT INTO _rls_results(status, test, detail)
  VALUES (
    CASE WHEN v_n = 0 THEN 'PASS' WHEN v_n > 0 THEN 'FAIL' ELSE 'ERROR' END,
    'User UPDATE - PLAYER sobre User ajeno (debe ser 0 filas)',
    'Filas: ' || v_n || CASE WHEN v_msg <> '' THEN ' | ' || v_msg ELSE '' END
  );

END $$;

-- ============================================================
-- RESULTADOS - pestana Results del SQL Editor
-- ============================================================
SELECT ord, status, test, detail FROM _rls_results ORDER BY ord;