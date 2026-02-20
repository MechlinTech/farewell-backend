/*
  Warnings:

  - You are about to drop the column `vehicleDetailId` on the `Rider` table. All the data in the column will be lost.
  - The `isVerified` column on the `Rider` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dropoffLat` on the `ScheduledDeliveryCart` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffLng` on the `ScheduledDeliveryCart` table. All the data in the column will be lost.
  - The `parcelStatus` column on the `ScheduledDeliveryCart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `vehicleRCNumber` on the `VehicleDetail` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDeliveryCartId` on the `deliveryRide` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffLat` on the `instantDeliveryCart` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffLng` on the `instantDeliveryCart` table. All the data in the column will be lost.
  - The `parcelStatus` column on the `instantDeliveryCart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dropLocation` to the `ScheduledDeliveryCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ScheduledDeliveryCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riderId` to the `VehicleDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleRC` to the `VehicleDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryType` to the `deliveryRide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropLocation` to the `instantDeliveryCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `instantDeliveryCart` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "riderVerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "deliveryType" AS ENUM ('INSTANT_DELIVERY', 'SCHEDULED_DELIVERY');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "addressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- DropForeignKey
ALTER TABLE "Rider" DROP CONSTRAINT "Rider_vehicleDetailId_fkey";

-- DropForeignKey
ALTER TABLE "deliveryRide" DROP CONSTRAINT "deliveryRide_deliveryCartId_fkey";

-- DropForeignKey
ALTER TABLE "deliveryRide" DROP CONSTRAINT "deliveryRide_scheduledDeliveryCartId_fkey";

-- DropIndex
DROP INDEX "ScheduledDeliveryCart_dropoffLat_dropoffLng_idx";

-- DropIndex
DROP INDEX "instantDeliveryCart_dropoffLat_dropoffLng_idx";

-- AlterTable
ALTER TABLE "Rider" DROP COLUMN "vehicleDetailId",
ADD COLUMN     "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vehicleDetailSet" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "isVerified",
ADD COLUMN     "isVerified" "riderVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "ScheduledDeliveryCart" DROP COLUMN "dropoffLat",
DROP COLUMN "dropoffLng",
ADD COLUMN     "deliveryType" "deliveryType" NOT NULL DEFAULT 'SCHEDULED_DELIVERY',
ADD COLUMN     "dropLocation" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tip" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "parcelStatus",
ADD COLUMN     "parcelStatus" "DeliveryStatus";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isLocationSet" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VehicleDetail" DROP COLUMN "vehicleRCNumber",
ADD COLUMN     "riderId" TEXT NOT NULL,
ADD COLUMN     "vehicleRC" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "deliveryRide" DROP COLUMN "scheduledDeliveryCartId",
ADD COLUMN     "deliveryType" "deliveryType" NOT NULL;

-- AlterTable
ALTER TABLE "instantDeliveryCart" DROP COLUMN "dropoffLat",
DROP COLUMN "dropoffLng",
ADD COLUMN     "deliveryType" "deliveryType" NOT NULL DEFAULT 'INSTANT_DELIVERY',
ADD COLUMN     "dropLocation" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tip" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "parcelStatus",
ADD COLUMN     "parcelStatus" "DeliveryStatus";

-- DropEnum
DROP TYPE "ParcelStatus";

-- CreateTable
CREATE TABLE "userAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "addressType" "addressType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VehicleDetail" ADD CONSTRAINT "VehicleDetail_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
