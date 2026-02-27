-- CreateTable
CREATE TABLE "contactCategory" (
    "id" TEXT NOT NULL,
    "type" "contactUsCategories" NOT NULL,

    CONSTRAINT "contactCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contactCategory_type_key" ON "contactCategory"("type");
