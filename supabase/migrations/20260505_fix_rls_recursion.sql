-- ES: Corrige recursión infinita entre Campaign_Select y Membership_Select.
--     Crea una función SECURITY DEFINER para verificar membresía sin aplicar RLS,
--     y actualiza ambas políticas para usar una estrategia sin ciclos.
--
-- EN: Fixes infinite recursion between Campaign_Select and Membership_Select.
--     Creates a SECURITY DEFINER function to check membership without RLS,
--     and updates both policies to use a cycle-free strategy.

-- ============================================================
-- 1. Helper SECURITY DEFINER — consulta Membership sin RLS
-- ============================================================
CREATE OR REPLACE FUNCTION is_campaign_member(p_campaign_id TEXT, p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Membership"
    WHERE "campaignId" = p_campaign_id
      AND "userId" = p_user_id
  );
$$;

-- ============================================================
-- 2. Campaign_Select — incluye al GM y a los miembros, sin ciclo
-- ============================================================
DROP POLICY IF EXISTS "Campaign_Select" ON "Campaign";

CREATE POLICY "Campaign_Select" ON "Campaign" FOR SELECT
  USING (
    -- Pública: visible para todos
    "isPublic" = true
    -- Propietario (GM): siempre puede ver sus campañas
    OR "gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    -- Miembro: verificado sin RLS (función SECURITY DEFINER)
    OR is_campaign_member(
         "Campaign"."id",
         (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
       )
  );

-- ============================================================
-- 3. Membership_Select — sin auto-referencia, sin ciclo
-- ============================================================
DROP POLICY IF EXISTS "Membership_Select" ON "Membership";

CREATE POLICY "Membership_Select" ON "Membership" FOR SELECT
  USING (
    -- El propio miembro ve su membresía
    "userId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    -- El GM de la campaña ve todas las membresías de su campaña
    OR EXISTS (
      SELECT 1 FROM "Campaign"
      WHERE "Campaign"."id" = "Membership"."campaignId"
        AND "Campaign"."gameMasterId" = (SELECT "id" FROM "User" WHERE "clerkId" = current_user_id())
    )
  );
