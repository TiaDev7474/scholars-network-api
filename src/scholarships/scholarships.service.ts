import { Injectable } from '@nestjs/common';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipsRepository } from './scholarships.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScholarshipsService {
  constructor(private readonly scholarshipRepository: ScholarshipsRepository) {}

  create(createScholarshipDto: CreateScholarshipDto, coverPhotoUrl: string) {
    const { hostCountriesIds, studyLevelsIds, ...rest } = createScholarshipDto;
    const data = {
      ...rest,
      coverPhoto: coverPhotoUrl,
      hostCountries: {
        create: hostCountriesIds.map((hostCountriesId) => ({
          country: {
            connect: {
              id: Number(hostCountriesId),
            },
          },
        })),
      },
      studyLevels: {
        create: studyLevelsIds.map((studyLevelsId) => ({
          studyLevel: {
            connect: {
              id: Number(studyLevelsId),
            },
          },
        })),
      },
    };
    const include: Prisma.ScholarshipInclude = {
      hostCountries: {
        select: {
          country: true,
        },
      },
      studyLevels: {
        select: {
          studyLevel: true,
        },
      },
    };

    return this.scholarshipRepository.create({ data, include });
  }

  findAll(params: {
    filterOptions: {
      q?: string;
      studyLevelId: string;
      countryId: string;
    };
  }) {
    const { filterOptions } = params;
    const where: Prisma.ScholarshipWhereInput = {
      ...(filterOptions.q
        ? {
            OR: [
              {
                name: {
                  contains: filterOptions.q.toLowerCase(),
                  mode: 'insensitive',
                },
              },
              {
                organizationName: {
                  contains: filterOptions.q.toLowerCase(),
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: filterOptions.q.toLowerCase(),
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(filterOptions.studyLevelId
        ? {
            studyLevels: {
              some: {
                studyLevelId: Number(filterOptions.studyLevelId),
              },
            },
          }
        : {}),
      ...(filterOptions.countryId
        ? {
            hostCountries: {
              some: {
                countryId: parseInt(filterOptions.countryId),
              },
            },
          }
        : {}),
    };

    return this.scholarshipRepository.findAll({ where });
  }
  async getScholarshipRecommendation(userId: string, take?: number) {
    return this.scholarshipRepository.getScholarshipRecommendation(
      userId,
      take,
    );
  }
  async getUpComingScholarship(take?: number) {
    return this.scholarshipRepository.getUpComingScholarship(take);
  }
  findOne(id: string) {
    return this.scholarshipRepository.findOne({
      where: {
        id,
      },
    });
  }
  async saveScholarship(scholarshipId: string, userId: string) {
    return this.scholarshipRepository.saveScholarship(scholarshipId, userId);
  }

  update(
    id: string,
    updateScholarshipDto: UpdateScholarshipDto,
    coverPhotoUrl?: string,
  ) {
    const { hostCountriesIds, studyLevelsIds, ...rest } = updateScholarshipDto;
    const data = {
      ...rest,
    };
    if (hostCountriesIds) {
      data['hostCountries'] = {
        deleteMany: {},
        create: hostCountriesIds.map((hostCountriesId) => ({
          country: {
            connect: {
              id: Number(hostCountriesId),
            },
          },
        })),
      };
    }
    if (coverPhotoUrl) {
      data['coverPhoto'] = coverPhotoUrl;
    }
    if (studyLevelsIds) {
      data['studyLevels'] = {
        deleteMany: {},
        create: studyLevelsIds.map((studyLevelsId) => ({
          studyLevel: {
            connect: {
              id: Number(studyLevelsId),
            },
          },
        })),
      };
    }

    return this.scholarshipRepository.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.scholarshipRepository.remove({
      where: {
        id,
      },
    });
  }
}
