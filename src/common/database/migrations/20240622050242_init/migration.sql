-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_currentStudyLevelId_fkey";

-- DropForeignKey
ALTER TABLE "ScholarshipHostCountry" DROP CONSTRAINT "ScholarshipHostCountry_scholarshipId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_currentStudyLevelId_fkey" FOREIGN KEY ("currentStudyLevelId") REFERENCES "StudyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipHostCountry" ADD CONSTRAINT "ScholarshipHostCountry_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
