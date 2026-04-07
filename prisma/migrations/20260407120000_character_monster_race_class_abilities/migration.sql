-- AlterTable CharacterTemplate
ALTER TABLE "CharacterTemplate"
  ADD COLUMN IF NOT EXISTS "race" TEXT NOT NULL DEFAULT 'Desconocido',
  ADD COLUMN IF NOT EXISTS "characterClass" TEXT NOT NULL DEFAULT 'Desconocido',
  ADD COLUMN IF NOT EXISTS "maxHp" INTEGER NOT NULL DEFAULT 8,
  ADD COLUMN IF NOT EXISTS "abilities" JSONB;

-- AlterTable MonsterTemplate
ALTER TABLE "MonsterTemplate"
  ADD COLUMN IF NOT EXISTS "race" TEXT NOT NULL DEFAULT 'Desconocido',
  ADD COLUMN IF NOT EXISTS "characterClass" TEXT NOT NULL DEFAULT 'Desconocido';
