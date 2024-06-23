-- DropForeignKey
ALTER TABLE "AcademicInterests" DROP CONSTRAINT "AcademicInterests_academicId_fkey";

-- DropForeignKey
ALTER TABLE "DesiredStudyCountry" DROP CONSTRAINT "DesiredStudyCountry_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_currentStudyLevelId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarshipHostCountry" DROP CONSTRAINT "ScholarshipHostCountry_countryId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarshipLevel" DROP CONSTRAINT "ScholarshipLevel_scholarshipId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarshipLevel" DROP CONSTRAINT "ScholarshipLevel_studyLevelId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_currentStudyLevelId_fkey" FOREIGN KEY ("currentStudyLevelId") REFERENCES "StudyLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipHostCountry" ADD CONSTRAINT "ScholarshipHostCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipLevel" ADD CONSTRAINT "ScholarshipLevel_studyLevelId_fkey" FOREIGN KEY ("studyLevelId") REFERENCES "StudyLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipLevel" ADD CONSTRAINT "ScholarshipLevel_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicInterests" ADD CONSTRAINT "AcademicInterests_academicId_fkey" FOREIGN KEY ("academicId") REFERENCES "Academics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredStudyCountry" ADD CONSTRAINT "DesiredStudyCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
