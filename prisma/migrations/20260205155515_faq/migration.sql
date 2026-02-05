-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'PAYMENT', 'CUSTOMER', 'RIDER', 'OTHER');

-- CreateTable
CREATE TABLE "userLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userLocation_locationLat_locationLng_idx" ON "userLocation"("locationLat", "locationLng");
