/*
  Warnings:

  - The values [CAMPAIGN] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `granterId` to the `AccessGrant` table without a default value. This is not possible if the table is not empty.
  - Made the column `campaignId` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CampaignRole" AS ENUM ('OWNER', 'EDITOR', 'PLAYER', 'VIEWER');

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('MONSTER_TEMPLATE', 'ITEM_TEMPLATE', 'CHARACTER_TEMPLATE');
ALTER TABLE "AccessGrant" ALTER COLUMN "resourceType" TYPE "ResourceType_new" USING ("resourceType"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "public"."ResourceType_old";
COMMIT;

-- AlterTable
ALTER TABLE "AccessGrant" ADD COLUMN     "granterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "campaignId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" "CampaignRole" NOT NULL DEFAULT 'PLAYER',
    "userId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Membership_campaignId_idx" ON "Membership"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_campaignId_key" ON "Membership"("userId", "campaignId");

-- CreateIndex
CREATE INDEX "AccessGrant_granterId_idx" ON "AccessGrant"("granterId");

-- AddForeignKey
ALTER TABLE "AccessGrant" ADD CONSTRAINT "AccessGrant_granterId_fkey" FOREIGN KEY ("granterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
