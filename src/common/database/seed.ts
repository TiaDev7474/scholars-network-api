import { Prisma, PrismaClient } from '@prisma/client';
import {
  academics,
  countryNames,
  scholarships,
  studyLevels,
} from './data/data';
const prisma = new PrismaClient();
async function main() {
  console.log('=========Seeding country table===========');
  await prisma.country.createMany({
    data: countryNames.map((countryName) => ({ name: countryName })),
    skipDuplicates: true,
  });
  console.log('=========country seeded===========');
  console.log('=========Seeding studyLevel table===========');
  await prisma.studyLevel.createMany({
    data: studyLevels,
    skipDuplicates: true,
  });
  console.log('=========StudyLevel seeded===========');
  console.log('=========Seeding academics table===========');
  await prisma.academics.createMany({
    data: academics.map((academic) => ({
      title: academic.title,
      key: academic.key,
    })),
    skipDuplicates: true,
  });
  console.log('=========Academics seeded===========');
  console.log('=========Seeding scholarships table===========');
  const createScholarships = scholarships.map(
    ({ studyLevelsIds, hostCountriesIds, ...rest }) =>
      prisma.scholarship.create({
        data: {
          ...rest,
          studyLevels: {
            create: studyLevelsIds.map((id) => ({
              studyLevel: {
                connect: { id },
              },
            })),
          },
          hostCountries: {
            create: hostCountriesIds.map((id) => ({
              country: {
                connect: { id },
              },
            })),
          },
        },
      }),
  );

  await Promise.all(createScholarships);
  console.log('=========scholarship seeded===========');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
