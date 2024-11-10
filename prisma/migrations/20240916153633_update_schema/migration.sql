/*
  Warnings:

  - You are about to drop the column `scope` on the `Bounty` table. All the data in the column will be lost.
  - Made the column `notes` on table `Bounty` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bounty" DROP COLUMN "scope",
ALTER COLUMN "notes" SET NOT NULL;
