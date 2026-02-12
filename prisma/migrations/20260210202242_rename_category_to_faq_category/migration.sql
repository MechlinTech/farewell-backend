/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `userLocation` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `category` on the `faq` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "vehicleType" AS ENUM ('CAR', 'BIKE', 'TRUCK');

-- CreateEnum
CREATE TYPE "RiderStatus" AS ENUM ('AVAILABLE', 'BUSY');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "FaqCategory" AS ENUM ('GENERAL', 'PAYMENT', 'CUSTOMER', 'RIDER', 'OTHER');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "escrowStatus" AS ENUM ('HELD', 'RELEASED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "deliveryRideStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "RiderStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "stripeAccountId" TEXT;

-- AlterTable
ALTER TABLE "ScheduledDeliveryCart" ADD COLUMN     "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "VehicleDetail" ADD COLUMN     "vehicleType" "vehicleType" NOT NULL DEFAULT 'CAR';

-- AlterTable
ALTER TABLE "faq" DROP COLUMN "category",
ADD COLUMN     "category" "FaqCategory" NOT NULL;

-- AlterTable
ALTER TABLE "instantDeliveryCart" ADD COLUMN     "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "paymentStatus" NOT NULL DEFAULT 'PENDING',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
    "escrowStatus" "escrowStatus",
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveryRide" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "riderId" TEXT,
    "deliveryCartId" TEXT NOT NULL,
    "paymentId" TEXT,
    "status" "deliveryRideStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "dropOffPicture" TEXT,
    "payoutDone" BOOLEAN NOT NULL DEFAULT false,
    "payoutProcessing" BOOLEAN NOT NULL DEFAULT false,
    "payoutAttemptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDeliveryCartId" TEXT,

    CONSTRAINT "deliveryRide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripePaymentIntentId_key" ON "payment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "deliveryRide_paymentId_key" ON "deliveryRide"("paymentId");

-- CreateIndex
CREATE INDEX "deliveryRide_status_payoutDone_completedAt_idx" ON "deliveryRide"("status", "payoutDone", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "userLocation_userId_key" ON "userLocation"("userId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryRide" ADD CONSTRAINT "deliveryRide_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryRide" ADD CONSTRAINT "deliveryRide_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryRide" ADD CONSTRAINT "deliveryRide_deliveryCartId_fkey" FOREIGN KEY ("deliveryCartId") REFERENCES "instantDeliveryCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryRide" ADD CONSTRAINT "deliveryRide_scheduledDeliveryCartId_fkey" FOREIGN KEY ("scheduledDeliveryCartId") REFERENCES "ScheduledDeliveryCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveryRide" ADD CONSTRAINT "deliveryRide_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
