/*
  Warnings:

  - You are about to drop the column `monsterId` on the `ActiveMonster` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `campaignId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Monster` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `ActiveMonster` table without a default value. This is not possible if the table is not empty.
  - Made the column `maxHp` on table `ActiveMonster` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gameMasterId` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characterId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SessionNote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActiveMonster" DROP CONSTRAINT "ActiveMonster_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "ActiveMonster" DROP CONSTRAINT "ActiveMonster_monsterId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_userId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "SessionNote" DROP CONSTRAINT "SessionNote_campaignId_fkey";

-- AlterTable
ALTER TABLE "ActiveMonster" DROP COLUMN "monsterId",
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "maxHp" SET NOT NULL;

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "userId",
ADD COLUMN     "gameMasterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "campaignId",
ADD COLUMN     "characterId" TEXT NOT NULL,
ALTER COLUMN "rarity" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SessionNote" ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE';

-- DropTable
DROP TABLE "Monster";

-- CreateTable
CREATE TABLE "CharacterTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "baseStats" JSONB NOT NULL,
    "suggestedEquipment" JSONB,
    "authorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "campaignId" TEXT,
    "templateId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentHp" INTEGER NOT NULL,
    "maxHp" INTEGER NOT NULL,
    "ac" INTEGER,
    "stats" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "challenge" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "maxHp" INTEGER NOT NULL,
    "ac" INTEGER NOT NULL,
    "stats" JSONB NOT NULL,
    "abilities" JSONB,
    "authorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonsterTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_gameMasterId_fkey" FOREIGN KEY ("gameMasterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterTemplate" ADD CONSTRAINT "CharacterTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CharacterTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterTemplate" ADD CONSTRAINT "MonsterTemplate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveMonster" ADD CONSTRAINT "ActiveMonster_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MonsterTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveMonster" ADD CONSTRAINT "ActiveMonster_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
