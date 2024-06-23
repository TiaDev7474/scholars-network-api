-- CreateTable
CREATE TABLE "SaveScholarship" (
    "scholarshipId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "SaveScholarship_pkey" PRIMARY KEY ("profileId","scholarshipId")
);

-- AddForeignKey
ALTER TABLE "SaveScholarship" ADD CONSTRAINT "SaveScholarship_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaveScholarship" ADD CONSTRAINT "SaveScholarship_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
