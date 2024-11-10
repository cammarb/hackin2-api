/*
  Warnings:

  - A unique constraint covering the columns `[stripeCheckoutId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCheckoutId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "stripeCheckoutId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripeCheckoutId_key" ON "Payments"("stripeCheckoutId");

-- CreateIndex
CREATE INDEX "Payments_stripeCheckoutId_bountyId_userId_idx" ON "Payments"("stripeCheckoutId", "bountyId", "userId");
