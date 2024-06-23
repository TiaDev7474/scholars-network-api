/*
  Warnings:

  - The primary key for the `ScholarshipLevel` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ScholarshipLevel" DROP CONSTRAINT "ScholarshipLevel_pkey",
ADD CONSTRAINT "ScholarshipLevel_pkey" PRIMARY KEY ("studyLevelId", "scholarshipId");
