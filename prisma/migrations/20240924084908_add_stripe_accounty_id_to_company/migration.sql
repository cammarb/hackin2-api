/*
  Warnings:

  - A unique constraint covering the columns `[stripeAccountId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeAccountId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SeverityReward" DROP CONSTRAINT "SeverityReward_programId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "stripeAccountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_stripeAccountId_key" ON "Company"("stripeAccountId");

-- AddForeignKey
ALTER TABLE "SeverityReward" ADD CONSTRAINT "SeverityReward_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
