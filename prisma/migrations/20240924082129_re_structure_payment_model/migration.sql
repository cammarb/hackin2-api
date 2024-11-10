/*
  Warnings:

  - You are about to drop the column `payedByCompanyMemberId` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_payedByCompanyMemberId_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "payedByCompanyMemberId",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_companyId_memberId_fkey" FOREIGN KEY ("companyId", "memberId") REFERENCES "CompanyMember"("companyId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
