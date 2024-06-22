/*
  Warnings:

  - Added the required column `fundingType` to the `Scholarship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationName` to the `Scholarship` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FundingType" AS ENUM ('FULLY_FUNDED', 'PARTIAL_FUNDED');

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "fundingType" "FundingType" NOT NULL,
ADD COLUMN     "organizationName" TEXT NOT NULL;
