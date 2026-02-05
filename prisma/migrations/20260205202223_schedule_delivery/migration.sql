-- CreateTable
CREATE TABLE "ScheduledDeliveryCart" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "pickupLat" DOUBLE PRECISION NOT NULL,
    "pickupLng" DOUBLE PRECISION NOT NULL,
    "dropoffLat" DOUBLE PRECISION NOT NULL,
    "dropoffLng" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" "Size" NOT NULL,
    "picture" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledDeliveryCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledDeliveryCart_pickupLat_pickupLng_idx" ON "ScheduledDeliveryCart"("pickupLat", "pickupLng");

-- CreateIndex
CREATE INDEX "ScheduledDeliveryCart_dropoffLat_dropoffLng_idx" ON "ScheduledDeliveryCart"("dropoffLat", "dropoffLng");

-- AddForeignKey
ALTER TABLE "ScheduledDeliveryCart" ADD CONSTRAINT "ScheduledDeliveryCart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
