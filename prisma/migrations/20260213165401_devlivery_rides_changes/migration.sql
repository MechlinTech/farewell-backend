/*
  Warnings:

  - You are about to drop the column `status` on the `ScheduledDeliveryCart` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `instantDeliveryCart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `deliveryRide` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `deliveryRide` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "deliveryRideStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "deliveryRideStatus" ADD VALUE 'RETURNED';

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ScheduledDeliveryCart" DROP COLUMN "status",
ADD COLUMN     "parcelStatus" "ParcelStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "deliveryRide" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "instantDeliveryCart" DROP COLUMN "status",
ADD COLUMN     "parcelStatus" "ParcelStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "DeliveryStatus";

-- CreateIndex
CREATE UNIQUE INDEX "deliveryRide_orderId_key" ON "deliveryRide"("orderId");
