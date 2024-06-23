-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_currentStudyLevelId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_currentStudyLevelId_fkey" FOREIGN KEY ("currentStudyLevelId") REFERENCES "StudyLevel"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
