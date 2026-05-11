-- ============================================================
-- STORAGE — Políticas RLS para questlog-assets y system
-- ============================================================
--
-- Estructura de questlog-assets (userId = Clerk ID del usuario):
--   {clerkId}/campaigns/{campaignId}/{archivo}
--   {clerkId}/profile/{archivo}
--   {clerkId}/characters/{archivo}
--   {clerkId}/monsters/{archivo}
--   {clerkId}/items/{archivo}
--   {clerkId}/assets/{archivo}
--
-- NOTA sobre autenticación:
--   Las subidas se hacen desde Server Actions con service_role,
--   que bypasea RLS. Las políticas aquí son defensa-en-profundidad
--   contra acceso directo a la API con la anon key.
--
-- NOTA sobre prevención de huérfanos:
--   Supabase no permite crear triggers en storage.objects desde el
--   SQL Editor (permission denied for schema storage).
--   La validación se hace en la capa de aplicación: antes de llamar
--   a supabase.storage.upload(), la Server Action verifica que la
--   entidad referenciada (Campaign, Template, etc.) exista en BD.
-- ============================================================


-- ============================================================
-- 0. Asegurar que los buckets existen
--    (si ya existen, el INSERT no hace nada por el ON CONFLICT)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('questlog-assets', 'questlog-assets', false),
  ('system',          'system',          true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 1. BUCKET: system (datos globales — solo lectura pública)
-- ============================================================

-- Eliminar políticas previas para evitar conflictos
DROP POLICY IF EXISTS "system_select_public" ON storage.objects;

-- Cualquiera puede leer (bucket público, pero la policy lo refuerza)
CREATE POLICY "system_select_public" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'system');

-- INSERT/UPDATE/DELETE solo vía service_role (no se crea policy:
-- sin policy permisiva, authenticated y anon no pueden escribir)


-- ============================================================
-- 2. BUCKET: questlog-assets
-- ============================================================
-- Eliminar políticas previas
DROP POLICY IF EXISTS "assets_select"  ON storage.objects;
DROP POLICY IF EXISTS "assets_insert"  ON storage.objects;
DROP POLICY IF EXISTS "assets_delete"  ON storage.objects;

-- Eliminar TODAS las políticas previas de questlog-assets,
-- independientemente del nombre (incluye las generadas por el
-- Dashboard como "Give users access to own folder 1hqjv3g_0", etc.)
DO $$
DECLARE
  pol TEXT;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND (qual       ILIKE '%questlog-assets%'
           OR with_check ILIKE '%questlog-assets%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol);
  END LOOP;
END $$;

-- ── SELECT ──────────────────────────────────────────────────
-- Un usuario puede leer:
--   a) Su propia carpeta raíz ({userId}/...)
--   b) Carpetas de campaña donde es miembro ({gmUserId}/campaigns/{campaignId}/...)
CREATE POLICY "assets_select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'questlog-assets'
    AND (
      -- (a) Carpeta propia: primer segmento = clerkId del usuario activo
      -- current_user_id() devuelve el clerkId (via app.current_user_id o auth.uid() del JWT de Clerk)
      (storage.foldername(name))[1] = current_user_id()
      OR
      -- (b) Carpeta de campaña: el usuario tiene Membership en esa campaña
      (
        (storage.foldername(name))[2] = 'campaigns'
        AND is_campaign_member(
          (storage.foldername(name))[3],
          (SELECT id FROM "User" WHERE "clerkId" = current_user_id())
        )
      )
    )
  );

-- ── INSERT ───────────────────────────────────────────────────
-- Solo se puede subir a la propia carpeta raíz.
-- La validación de campaña/template la hace el trigger de huérfanos.
CREATE POLICY "assets_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'questlog-assets'
    AND (storage.foldername(name))[1] = current_user_id()
  );

-- ── DELETE ───────────────────────────────────────────────────
-- Puede borrar quien subió (carpeta propia) O un EDITOR/OWNER de la campaña.
CREATE POLICY "assets_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'questlog-assets'
    AND (
      -- Carpeta propia
      (storage.foldername(name))[1] = current_user_id()
      OR
      -- OWNER/EDITOR de la campaña referenciada
      (
        (storage.foldername(name))[2] = 'campaigns'
        AND can_edit_campaign(
          (storage.foldername(name))[3],
          (SELECT id FROM "User" WHERE "clerkId" = current_user_id())
        )
      )
    )
  );

