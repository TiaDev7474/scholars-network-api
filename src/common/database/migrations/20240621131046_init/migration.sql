-- CreateTable
CREATE TABLE "AcademicInteresrts" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "academicId" INTEGER NOT NULL,

    CONSTRAINT "AcademicInteresrts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Academics" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Academics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicInteresrts" ADD CONSTRAINT "AcademicInteresrts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicInteresrts" ADD CONSTRAINT "AcademicInteresrts_academicId_fkey" FOREIGN KEY ("academicId") REFERENCES "Academics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
