/*
  Warnings:

  - A unique constraint covering the columns `[emailId]` on the table `contactUs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "contactUs_emailId_key" ON "contactUs"("emailId");
