/*
  Warnings:

  - You are about to drop the column `declaredBy` on the `results` table. All the data in the column will be lost.
  - Added the required column `declaredById` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_declaredBy_fkey";

-- AlterTable
ALTER TABLE "results" DROP COLUMN "declaredBy",
ADD COLUMN     "declaredById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_declaredById_fkey" FOREIGN KEY ("declaredById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
