/*
  Warnings:

  - You are about to drop the `userLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userLocation" DROP CONSTRAINT "userLocation_userId_fkey";

-- AlterTable
ALTER TABLE "userAddress" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "userLocation";
