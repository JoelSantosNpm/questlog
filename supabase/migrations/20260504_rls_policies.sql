-- ============================================================
-- ROW LEVEL SECURITY — Questlog
-- ============================================================
--
-- ES: Este archivo configura la seguridad a nivel de fila (RLS) para todas
-- las tablas del proyecto. Debe ejecutarse manualmente en el SQL Editor de
-- Supabase — Prisma no gestiona policies ni funciones PL/pgSQL.
--
-- Arquitectura de dos clientes:
--   prismaAdmin  → rol postgres (superusuario), bypasea RLS.
--                  Uso: Clerk webhook, AuthSync. Sin contexto de usuario.
--   withRLS()    → cambia a rol `authenticated` dentro de la transacción +
--                  establece app.current_user_id. RLS se aplica completamente.
--                  Uso: todas las Server Actions y queries de usuario final.
--
-- EN: This file configures Row Level Security (RLS) for all project tables.
-- Must be executed manually in the Supabase SQL Editor — Prisma does not
-- manage policies or PL/pgSQL functions.
--
-- Two-client architecture:
--   prismaAdmin  → postgres role (superuser), bypasses RLS.
--                  Use: Clerk webhook, AuthSync. No user session context.
--   withRLS()    → switches to `authenticated` role within the transaction +
--                  sets app.current_user_id. RLS is fully enforced.
--                  Use: all Server Actions and end-user data queries.
--
-- ============================================================

-- ------------------------------------------------------------
-- 0. HELPER: current_user_id()
--
-- ES: Función puente que detecta el origen del userId:
--   - Prisma withRLS  → lee app.current_user_id (set_config IS LOCAL)
--   - Supabase SDK    → lee auth.uid() del JWT
-- Retorna el clerkId del usuario activo como texto.
-- COALESCE garantiza que si una fuente es nula, se usa la otra.
-- NOTA: La propuesta original usaba OR (inválido para coalescencia de texto).
--
-- EN: Bridge function that detects the userId source:
--   - Prisma withRLS  → reads app.current_user_id (set_config IS LOCAL)
--   - Supabase SDK    → reads auth.uid() from JWT
-- Returns the active user's clerkId as text.
-- COALESCE ensures that if one source is null, the other is used.
-- NOTE: Original proposal used OR (invalid for text coalescing).
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text AS $$
  SELECT COALESCE(
    nullif(current_setting('app.current_user_id', true), ''),
    auth.uid()::text
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------
-- 1. GRANT — Permisos al rol authenticated
--
-- ES: Sin estos permisos, SET LOCAL ROLE authenticated causaría errores de
-- permisos antes de que RLS evalúe nada. Se otorgan SELECT/INSERT/UPDATE/DELETE
-- sobre todas las tablas; las políticas RLS restringen el acceso a nivel de fila.
--
-- EN: Without these grants, SET LOCAL ROLE authenticated would fail with
-- permission errors before RLS even evaluates. SELECT/INSERT/UPDATE/DELETE
-- are granted on all tables; RLS policies restrict access at the row level.
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ------------------------------------------------------------
-- 2. ENABLE RLS — Activar seguridad por filas en todas las tablas
--
-- ES: Con RLS activo, cualquier query bajo el rol `authenticated` solo ve
-- las filas que las políticas permiten. El rol `postgres` (superusuario)
-- sigue bypasseando RLS — por eso prismaAdmin existe como cliente separado.
--
-- EN: With RLS enabled, any query under the `authenticated` role only sees
-- rows allowed by policies. The `postgres` role (superuser) still bypasses
-- RLS — that's why prismaAdmin exists as a separate client.
-- ------------------------------------------------------------
ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Campaign"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Character"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CharacterTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MonsterTemplate"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ItemTemplate"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Item"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SessionNote"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ActiveMonster"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quest"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AccessGrant"       ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 3. DROP políticas legacy / DROP legacy policies
--
-- ES: Las políticas de 20260327_init_schema.sql usaban auth.uid() directamente
-- (solo funciona con Supabase SDK). Se eliminan para evitar conflictos.
--
-- EN: Policies from 20260327_init_schema.sql used auth.uid() directly
-- (Supabase SDK only). Dropped to avoid conflicts.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own data"        ON "User";
DROP POLICY IF EXISTS "Users can update own data"      ON "User";
DROP POLICY IF EXISTS "GM can manage own campaigns"    ON "Campaign";

-- ============================================================
-- USER
-- ES: Solo el propietario puede leer/actualizar su propio registro.
-- INSERT omitido intencionalmente: solo postgres/service_role
-- (Clerk webhook + AuthSync) puede crear filas en User.
--
-- EN: Only the owner can read/update their own record.
-- INSERT intentionally omitted: only postgres/service_role
-- (Clerk webhook + AuthSync) may create User rows.
-- ============================================================
CREATE POLICY "User_Select" ON "User" FOR SELECT
  USING ("clerkId" = current_user_id());

CREATE POLICY "User_Update" ON "User" FOR UPDATE
  USING ("clerkId" = current_user_id());

-- ============================================================
-- CAMPAIGN
-- ES: SELECT abierto para campañas públicas; privadas solo para miembros.
-- INSERT requiere que gameMasterId sea el usuario activo.
-- UPDATE solo para OWNER o EDITOR (vía Membership).
-- DELETE solo para el gameMaster original.
--
-- EN: SELECT open for public campaigns; private only for members.
-- INSERT requires gameMasterId to match the active user.
-- UPDATE only for OWNER or EDITOR (via Membership).
-- DELETE only for the original gameMaster.
-- ============================================================

-- Public campaigns are visible to everyone; private only to members.
CREATE POLICY "Campaign_Select" ON "Campaign" FOR SELECT
  USING (
    "isPublic" = true
    OR EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Campaign"."id"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

-- The gameMasterId on INSERT must match the session user.
CREATE POLICY "Campaign_Insert" ON "Campaign" FOR INSERT
  WITH CHECK (
    "gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

-- Only OWNER or EDITOR members can update.
CREATE POLICY "Campaign_Update" ON "Campaign" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Campaign"."id"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- Only the gameMaster (OWNER) can delete.
CREATE POLICY "Campaign_Delete" ON "Campaign" FOR DELETE
  USING (
    "gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

-- ============================================================
-- MEMBERSHIP
-- ES: Un usuario ve sus propias membresías y las de sus compañeros de campaña.
-- Solo el gameMaster (OWNER) de la campaña puede añadir/eliminar miembros.
--
-- EN: A user sees their own memberships and their campaign-mates'.
-- Only the campaign's gameMaster (OWNER) can add/remove members.
-- ============================================================

-- A user can see their own memberships and their campaign-mates'.
CREATE POLICY "Membership_Select" ON "Membership" FOR SELECT
  USING (
    "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    OR "campaignId" IN (
      SELECT "campaignId" FROM "Membership"
      WHERE "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

-- Only the campaign's gameMaster can add/remove/update members.
CREATE POLICY "Membership_Admin" ON "Membership" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Campaign"
      WHERE "id" = "Membership"."campaignId"
        AND "gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

-- ============================================================
-- CHARACTER
-- ES: Todos los miembros de la campaña pueden leer los personajes.
-- INSERT: cualquier miembro puede crear un personaje en su campaña.
-- UPDATE/DELETE: el dueño del personaje O un DM (OWNER/EDITOR).
--
-- EN: All campaign members can read characters.
-- INSERT: any member can create a character in their campaign.
-- UPDATE/DELETE: the character owner OR a DM (OWNER/EDITOR).
-- ============================================================

-- Campaign members can read characters.
CREATE POLICY "Character_Select" ON "Character" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Character"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

-- Members of the campaign can create characters in it.
CREATE POLICY "Character_Insert" ON "Character" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Character"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

-- The character owner OR a DM (OWNER/EDITOR) can update.
CREATE POLICY "Character_Update" ON "Character" FOR UPDATE
  USING (
    "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    OR EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Character"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- Same rule for delete.
CREATE POLICY "Character_Delete" ON "Character" FOR DELETE
  USING (
    "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    OR EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Character"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- ============================================================
-- ACTIVE MONSTER — instancias de combate, solo DM
-- ES: Todos los miembros ven los monstruos activos.
-- Solo OWNER/EDITOR puede crear, modificar o eliminarlos.
--
-- EN: All members can see active monsters.
-- Only OWNER/EDITOR can create, modify, or delete them.
-- ============================================================
CREATE POLICY "ActiveMonster_Select" ON "ActiveMonster" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "ActiveMonster"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

CREATE POLICY "ActiveMonster_Manage" ON "ActiveMonster" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "ActiveMonster"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- ============================================================
-- QUEST
-- ES: OWNER/EDITOR ven todas las misiones. Los jugadores (PLAYER/VIEWER)
-- solo ven las marcadas con visibleToPlayers=true.
-- Solo OWNER/EDITOR puede gestionar misiones.
--
-- EN: OWNER/EDITOR see all quests. Players (PLAYER/VIEWER)
-- only see quests flagged visibleToPlayers=true.
-- Only OWNER/EDITOR can manage quests.
-- ============================================================
CREATE POLICY "Quest_Select" ON "Quest" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Quest"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND (
          "role" IN ('OWNER', 'EDITOR')
          OR "Quest"."visibleToPlayers" = true
        )
    )
  );

CREATE POLICY "Quest_Manage" ON "Quest" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Quest"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- ============================================================
-- SESSION NOTE — notas del DM, privadas para jugadores
-- ES: Solo OWNER/EDITOR pueden ver y gestionar las notas de sesión.
-- Los jugadores no tienen acceso en ningún caso.
--
-- EN: Only OWNER/EDITOR can view and manage session notes.
-- Players have no access under any circumstance.
-- ============================================================
CREATE POLICY "SessionNote_Select" ON "SessionNote" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "SessionNote"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

CREATE POLICY "SessionNote_Manage" ON "SessionNote" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "SessionNote"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- ============================================================
-- ITEM — botín de campaña e inventario de personaje
-- ES: Todos los miembros ven los ítems de la campaña.
-- Solo OWNER/EDITOR puede crear, modificar o eliminar ítems.
--
-- EN: All campaign members can see items.
-- Only OWNER/EDITOR can create, modify, or delete items.
-- ============================================================
CREATE POLICY "Item_Select" ON "Item" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Item"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );

CREATE POLICY "Item_Manage" ON "Item" FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Membership"
      WHERE "campaignId" = "Item"."campaignId"
        AND "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
        AND "role" IN ('OWNER', 'EDITOR')
    )
  );

-- ============================================================
-- ENCYCLOPEDIA TEMPLATES — MonsterTemplate, CharacterTemplate, ItemTemplate
-- ES: Plantillas públicas (isPublic=true) visibles para todos.
-- Solo el autor puede crear, modificar o eliminar sus propias plantillas.
-- Las plantillas privadas (isPublic=false) solo las ve su autor.
--
-- EN: Public templates (isPublic=true) are visible to everyone.
-- Only the author can create, modify, or delete their own templates.
-- Private templates (isPublic=false) are only visible to their author.
-- ============================================================

-- MonsterTemplate
CREATE POLICY "MonsterTemplate_Select" ON "MonsterTemplate" FOR SELECT
  USING (
    "isPublic" = true
    OR "authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "MonsterTemplate_Insert" ON "MonsterTemplate" FOR INSERT
  WITH CHECK (
    "authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "MonsterTemplate_Manage" ON "MonsterTemplate" FOR UPDATE
  USING ("authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

CREATE POLICY "MonsterTemplate_Delete" ON "MonsterTemplate" FOR DELETE
  USING ("authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

-- CharacterTemplate
CREATE POLICY "CharacterTemplate_Select" ON "CharacterTemplate" FOR SELECT
  USING (
    "isPublic" = true
    OR "authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "CharacterTemplate_Insert" ON "CharacterTemplate" FOR INSERT
  WITH CHECK (
    "authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "CharacterTemplate_Manage" ON "CharacterTemplate" FOR UPDATE
  USING ("authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

CREATE POLICY "CharacterTemplate_Delete" ON "CharacterTemplate" FOR DELETE
  USING ("authorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

-- ItemTemplate
CREATE POLICY "ItemTemplate_Select" ON "ItemTemplate" FOR SELECT
  USING (
    "isPublic" = true
    OR "creatorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "ItemTemplate_Insert" ON "ItemTemplate" FOR INSERT
  WITH CHECK (
    "creatorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "ItemTemplate_Manage" ON "ItemTemplate" FOR UPDATE
  USING ("creatorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

CREATE POLICY "ItemTemplate_Delete" ON "ItemTemplate" FOR DELETE
  USING ("creatorId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id()));

-- ============================================================
-- ACCESS GRANT — permisos sobre recursos compartidos
-- ES: Un usuario ve los grants que ha recibido y los que ha otorgado.
-- Solo el grantador puede crear, modificar o revocar grants.
--
-- EN: A user sees grants they received and grants they gave.
-- Only the granter can create, modify, or revoke grants.
-- ============================================================
CREATE POLICY "AccessGrant_Select" ON "AccessGrant" FOR SELECT
  USING (
    "granteeId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    OR "granterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );

CREATE POLICY "AccessGrant_Manage" ON "AccessGrant" FOR ALL
  USING (
    "granterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
  );
