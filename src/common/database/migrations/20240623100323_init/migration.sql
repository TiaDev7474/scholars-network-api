/*
  Warnings:

  - You are about to drop the column `officialLnk` on the `Scholarship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "officialLnk",
ADD COLUMN     "officialLink" TEXT;
