/*
  Warnings:

  - Added the required column `category` to the `contactUs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "contactUsCategories" AS ENUM ('PAYMENT_AND_REFUND', 'DELIVERY_AND_RIDER', 'ACCOUNT_AND_VERIFICATION', 'TECHNICAL_ISSUES', 'SAFETY_FRAUD_AND_POLICY');

-- AlterTable
ALTER TABLE "contactUs" ADD COLUMN     "category" "contactUsCategories" NOT NULL;
