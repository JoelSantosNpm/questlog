-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "isPrivate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CharacterTemplate" ALTER COLUMN "isPublished" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MonsterTemplate" ALTER COLUMN "isPublished" DROP NOT NULL;
