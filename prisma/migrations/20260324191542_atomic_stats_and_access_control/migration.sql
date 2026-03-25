/*
  Warnings:

  - You are about to drop the column `stats` on the `ActiveMonster` table. All the data in the column will be lost.
  - You are about to drop the column `stats` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `baseStats` on the `CharacterTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedEquipment` on the `CharacterTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `attuned` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `equipped` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Item` table. All the data in the column will be lost.
  - The `rarity` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `stats` on the `MonsterTemplate` table. All the data in the column will be lost.
  - Made the column `ac` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `campaignId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('JUNK', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('MONSTER_TEMPLATE', 'ITEM_TEMPLATE', 'CHARACTER_TEMPLATE', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('VIEW', 'EDIT');

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_characterId_fkey";

-- AlterTable
ALTER TABLE "ActiveMonster" DROP COLUMN "stats",
ADD COLUMN     "ac" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "perception" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "nextSession" TIMESTAMP(3),
ADD COLUMN     "parentCampaignId" TEXT,
ADD COLUMN     "system" TEXT NOT NULL DEFAULT 'D&D 5e';

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "stats",
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "perception" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "tempHp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "ac" SET NOT NULL,
ALTER COLUMN "ac" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "CharacterTemplate" DROP COLUMN "baseStats",
DROP COLUMN "suggestedEquipment",
ADD COLUMN     "ac" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "perception" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "attuned",
DROP COLUMN "equipped",
DROP COLUMN "image",
DROP COLUMN "type",
DROP COLUMN "value",
DROP COLUMN "weight",
ADD COLUMN     "ac" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "campaignId" TEXT NOT NULL,
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isAttuned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isEquipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "perception" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "rarity",
ADD COLUMN     "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
ALTER COLUMN "characterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MonsterTemplate" DROP COLUMN "stats",
ADD COLUMN     "charisma" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "constitution" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dexterity" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "perception" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "strength" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "wisdom" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "ac" SET DEFAULT 10;

-- CreateTable
CREATE TABLE "ItemTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "value" INTEGER NOT NULL DEFAULT 0,
    "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "strength" INTEGER NOT NULL DEFAULT 0,
    "dexterity" INTEGER NOT NULL DEFAULT 0,
    "constitution" INTEGER NOT NULL DEFAULT 0,
    "intelligence" INTEGER NOT NULL DEFAULT 0,
    "wisdom" INTEGER NOT NULL DEFAULT 0,
    "charisma" INTEGER NOT NULL DEFAULT 0,
    "ac" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "initiativeBonus" INTEGER NOT NULL DEFAULT 0,
    "perception" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "visibleToPlayers" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessGrant" (
    "id" TEXT NOT NULL,
    "granteeId" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "access" "AccessType" NOT NULL DEFAULT 'VIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemTemplate_rarity_idx" ON "ItemTemplate"("rarity");

-- CreateIndex
CREATE INDEX "ItemTemplate_category_idx" ON "ItemTemplate"("category");

-- CreateIndex
CREATE INDEX "AccessGrant_granteeId_idx" ON "AccessGrant"("granteeId");

-- CreateIndex
CREATE INDEX "AccessGrant_resourceId_idx" ON "AccessGrant"("resourceId");

-- CreateIndex
CREATE INDEX "ActiveMonster_campaignId_idx" ON "ActiveMonster"("campaignId");

-- CreateIndex
CREATE INDEX "Character_userId_idx" ON "Character"("userId");

-- CreateIndex
CREATE INDEX "Character_campaignId_idx" ON "Character"("campaignId");

-- CreateIndex
CREATE INDEX "CharacterTemplate_strength_idx" ON "CharacterTemplate"("strength");

-- CreateIndex
CREATE INDEX "CharacterTemplate_dexterity_idx" ON "CharacterTemplate"("dexterity");

-- CreateIndex
CREATE INDEX "CharacterTemplate_ac_idx" ON "CharacterTemplate"("ac");

-- CreateIndex
CREATE INDEX "Item_campaignId_idx" ON "Item"("campaignId");

-- CreateIndex
CREATE INDEX "Item_characterId_idx" ON "Item"("characterId");

-- CreateIndex
CREATE INDEX "MonsterTemplate_challenge_idx" ON "MonsterTemplate"("challenge");

-- CreateIndex
CREATE INDEX "MonsterTemplate_type_idx" ON "MonsterTemplate"("type");

-- AddForeignKey
ALTER TABLE "ItemTemplate" ADD CONSTRAINT "ItemTemplate_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ItemTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessGrant" ADD CONSTRAINT "AccessGrant_granteeId_fkey" FOREIGN KEY ("granteeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
