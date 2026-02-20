/*
  Warnings:

  - The `status` column on the `Rider` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RiderWorkStatus" AS ENUM ('IDLE', 'ASSIGNED', 'PICKED_UP', 'ON_TRIP');

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "currentRideId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "RiderWorkStatus" NOT NULL DEFAULT 'IDLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fcmToken" TEXT;

-- AlterTable
ALTER TABLE "deliveryRide" ADD COLUMN     "pickupReached" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "RiderStatus";
