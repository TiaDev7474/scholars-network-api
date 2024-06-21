/*
  Warnings:

  - The primary key for the `AcademicInterests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AcademicInterests` table. All the data in the column will be lost.
  - The primary key for the `DesiredStudyCountry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DesiredStudyCountry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AcademicInterests" DROP CONSTRAINT "AcademicInterests_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AcademicInterests_pkey" PRIMARY KEY ("academicId", "profileId");

-- AlterTable
ALTER TABLE "DesiredStudyCountry" DROP CONSTRAINT "DesiredStudyCountry_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DesiredStudyCountry_pkey" PRIMARY KEY ("profileId", "countryId");

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "officialLnk" TEXT,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverPhoto" TEXT,
    "startApplicationDate" TIMESTAMP(3),
    "endApplicationDate" TIMESTAMP(3),
    "applicationStartPeriod" TEXT NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipHostCountry" (
    "countryId" INTEGER NOT NULL,
    "scholarshipId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipHostCountry_pkey" PRIMARY KEY ("countryId","scholarshipId")
);

-- CreateTable
CREATE TABLE "ScholarshipLevel" (
    "studyLevelId" INTEGER NOT NULL,
    "scholarshipId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipLevel_pkey" PRIMARY KEY ("studyLevelId")
);

-- AddForeignKey
ALTER TABLE "ScholarshipHostCountry" ADD CONSTRAINT "ScholarshipHostCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipHostCountry" ADD CONSTRAINT "ScholarshipHostCountry_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipLevel" ADD CONSTRAINT "ScholarshipLevel_studyLevelId_fkey" FOREIGN KEY ("studyLevelId") REFERENCES "StudyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipLevel" ADD CONSTRAINT "ScholarshipLevel_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
