-- AlterTable
ALTER TABLE "ActiveMonster" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "portraitImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "portraitImageUrl" TEXT;

-- AlterTable
ALTER TABLE "CharacterTemplate" ADD COLUMN     "portraitImageUrl" TEXT;

-- AlterTable
ALTER TABLE "MonsterTemplate" ADD COLUMN     "portraitImageUrl" TEXT;
