/*
  Warnings:

  - The primary key for the `BountyAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BountyAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `bountyAssignmentId` on the `Payments` table. All the data in the column will be lost.
  - You are about to drop the `Submissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bountyId,userId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bountyId` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_bountyAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Submissions" DROP CONSTRAINT "Submissions_bountyAssignmentId_fkey";

-- DropIndex
DROP INDEX "BountyAssignment_bountyId_userId_status_idx";

-- DropIndex
DROP INDEX "BountyAssignment_id_key";

-- DropIndex
DROP INDEX "Payments_bountyAssignmentId_key";

-- AlterTable
ALTER TABLE "BountyAssignment" DROP CONSTRAINT "BountyAssignment_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BountyAssignment_pkey" PRIMARY KEY ("bountyId", "userId");

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "bountyAssignmentId",
ADD COLUMN     "bountyId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Submissions";

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "bountyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "findings" TEXT[],
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_id_key" ON "Submission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_bountyId_userId_key" ON "Submission"("bountyId", "userId");

-- CreateIndex
CREATE INDEX "BountyAssignment_status_idx" ON "BountyAssignment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_bountyId_userId_key" ON "Payments"("bountyId", "userId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_bountyId_userId_fkey" FOREIGN KEY ("bountyId", "userId") REFERENCES "BountyAssignment"("bountyId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_bountyId_userId_fkey" FOREIGN KEY ("bountyId", "userId") REFERENCES "BountyAssignment"("bountyId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;
