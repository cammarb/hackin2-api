/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `BountyAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BountyAssignment_applicationId_key" ON "BountyAssignment"("applicationId");
