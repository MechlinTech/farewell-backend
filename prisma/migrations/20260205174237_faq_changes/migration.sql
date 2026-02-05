/*
  Warnings:

  - A unique constraint covering the columns `[question]` on the table `faq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "faq_question_key" ON "faq"("question");
