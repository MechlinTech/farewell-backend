-- CreateTable
CREATE TABLE "vehicleTypes" (
    "id" TEXT NOT NULL,
    "type" "vehicleType" NOT NULL,

    CONSTRAINT "vehicleTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicleTypes_type_key" ON "vehicleTypes"("type");
