/*
  Warnings:

  - Added the required column `programId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payments_stripeCheckoutId_bountyId_userId_idx";

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "programId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payments_stripeCheckoutId_bountyId_userId_programId_idx" ON "Payments"("stripeCheckoutId", "bountyId", "userId", "programId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
