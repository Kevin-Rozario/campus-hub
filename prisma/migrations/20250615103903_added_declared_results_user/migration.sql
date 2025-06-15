/*
  Warnings:

  - Added the required column `declaredBy` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "results" ADD COLUMN     "declaredBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_declaredBy_fkey" FOREIGN KEY ("declaredBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
