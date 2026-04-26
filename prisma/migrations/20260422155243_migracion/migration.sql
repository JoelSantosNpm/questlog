/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `CharacterTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `MonsterTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "isPrivate",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CharacterTemplate" DROP COLUMN "isPublished",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MonsterTemplate" DROP COLUMN "isPublished",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
