/*
  Warnings:

  - You are about to drop the column `programId` on the `Submissions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Submissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bountyAssignmentId]` on the table `Submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAYED');

-- DropForeignKey
ALTER TABLE "Submissions" DROP CONSTRAINT "Submissions_programId_fkey";

-- DropForeignKey
ALTER TABLE "Submissions" DROP CONSTRAINT "Submissions_userId_fkey";

-- DropIndex
DROP INDEX "BountyAssignment_bountyId_userId_idx";

-- DropIndex
DROP INDEX "Submissions_bountyAssignmentId_userId_key";

-- AlterTable
ALTER TABLE "Submissions" DROP COLUMN "programId",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "bountyAssignmentId" TEXT NOT NULL,
    "payedByCompanyMemberId" TEXT NOT NULL,
    "payedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payments_id_key" ON "Payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_bountyAssignmentId_key" ON "Payments"("bountyAssignmentId");

-- CreateIndex
CREATE INDEX "BountyAssignment_bountyId_userId_status_idx" ON "BountyAssignment"("bountyId", "userId", "status");

-- CreateIndex
CREATE INDEX "Program_programStatus_idx" ON "Program"("programStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Submissions_bountyAssignmentId_key" ON "Submissions"("bountyAssignmentId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bountyAssignmentId_fkey" FOREIGN KEY ("bountyAssignmentId") REFERENCES "BountyAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_payedByCompanyMemberId_fkey" FOREIGN KEY ("payedByCompanyMemberId") REFERENCES "CompanyMember"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
