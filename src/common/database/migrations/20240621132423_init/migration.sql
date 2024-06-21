/*
  Warnings:

  - You are about to drop the `AcademicInteresrts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AcademicInteresrts" DROP CONSTRAINT "AcademicInteresrts_academicId_fkey";

-- DropForeignKey
ALTER TABLE "AcademicInteresrts" DROP CONSTRAINT "AcademicInteresrts_profileId_fkey";

-- DropTable
DROP TABLE "AcademicInteresrts";

-- CreateTable
CREATE TABLE "AcademicInterests" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "academicId" INTEGER NOT NULL,

    CONSTRAINT "AcademicInterests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicInterests" ADD CONSTRAINT "AcademicInterests_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicInterests" ADD CONSTRAINT "AcademicInterests_academicId_fkey" FOREIGN KEY ("academicId") REFERENCES "Academics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
