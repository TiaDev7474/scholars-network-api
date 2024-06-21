/*
  Warnings:

  - You are about to drop the `Counrty` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `countryId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentStudyLevelId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "countryId" INTEGER NOT NULL,
ADD COLUMN     "currentStudyLevelId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Counrty";

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesiredStudyCountry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "DesiredStudyCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "StudyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudyLevel_name_key" ON "StudyLevel"("name");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_currentStudyLevelId_fkey" FOREIGN KEY ("currentStudyLevelId") REFERENCES "StudyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredStudyCountry" ADD CONSTRAINT "DesiredStudyCountry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredStudyCountry" ADD CONSTRAINT "DesiredStudyCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
