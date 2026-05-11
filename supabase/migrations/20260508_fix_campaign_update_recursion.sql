-- ============================================================
-- ES: Corrige recursión infinita en Campaign_Update y Membership_Select.
--
-- Raíz del problema:
--   Campaign_Update → lee Membership → Membership_Select → lee Campaign
--   → PostgreSQL detecta que Campaign ya está en evaluación → RECURSION
--
-- Solución: dos funciones SECURITY DEFINER que leen directamente (sin RLS),
-- rompiendo el ciclo en ambos sentidos.
--
-- EN: Fixes infinite recursion in Campaign_Update and Membership_Select.
--
-- Root cause:
--   Campaign_Update → reads Membership → Membership_Select → reads Campaign
--   → PostgreSQL detects Campaign is already being evaluated → RECURSION
--
-- Fix: two SECURITY DEFINER functions that read directly (no RLS),
-- breaking the cycle in both directions.
-- ============================================================


-- ============================================================
-- 1. SECURITY DEFINER helpers
-- ============================================================

-- Comprueba si un usuario tiene rol OWNER o EDITOR en una campaña.
-- Bypasea RLS en Membership → no dispara Membership_Select.
CREATE OR REPLACE FUNCTION can_edit_campaign(p_campaign_id TEXT, p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "campaignId" = p_campaign_id
      AND "userId"     = p_user_id
      AND "role" IN ('OWNER', 'EDITOR')
  );
$$;

-- Comprueba si un usuario es el GM (gameMaster) de una campaña.
-- Bypasea RLS en Campaign → no dispara Campaign_Select.
CREATE OR REPLACE FUNCTION is_campaign_gm(p_campaign_id TEXT, p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Campaign"
    WHERE "id"           = p_campaign_id
      AND "gameMasterId" = p_user_id
  );
$$;


-- ============================================================
-- 2. Campaign_Update — usa can_edit_campaign() para evitar ciclo
--    Campaign → Membership (RLS) → Campaign
-- ============================================================
DROP POLICY IF EXISTS "Campaign_Update" ON "Campaign";

CREATE POLICY "Campaign_Update" ON "Campaign" FOR UPDATE
  USING (
    -- El GM puede actualizar su propia campaña
    "gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    -- Un EDITOR también puede actualizar (verificado sin RLS)
    OR can_edit_campaign(
         "Campaign"."id",
         (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
       )
  );


-- ============================================================
-- 3. Membership_Select — usa is_campaign_gm() para evitar ciclo
--    Membership → Campaign (RLS) → Membership
-- ============================================================
DROP POLICY IF EXISTS "Membership_Select" ON "Membership";

CREATE POLICY "Membership_Select" ON "Membership" FOR SELECT
  USING (
    -- El propio miembro ve su membresía
    "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    -- El GM de la campaña ve todas las membresías de su campaña (verificado sin RLS)
    OR is_campaign_gm(
         "Membership"."campaignId",
         (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
       )
  );
