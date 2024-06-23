import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { Prisma } from '@prisma/client';
import { share } from 'rxjs';
import recommendedConfig from 'eslint-plugin-prettier/recommended';

@Injectable()
export class ScholarshipsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(params: {
    data: Prisma.ScholarshipCreateInput;
    include: Prisma.ScholarshipInclude;
  }) {
    const { data, include } = params;
    return this.prisma.scholarship.create({
      data,
      include,
    });
  }
  async update(params: {
    where: Prisma.ScholarshipWhereUniqueInput;
    data: Prisma.ScholarshipUpdateInput;
    include?: Prisma.ScholarshipInclude;
  }) {
    const { where, data, include } = params;
    return this.prisma.scholarship.update({
      where,
      data,
      include,
    });
  }
  async remove(params: { where: Prisma.ScholarshipWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.scholarship.delete({
      where,
    });
  }
  async findAll(params: {
    where: Prisma.ScholarshipWhereInput;
    include?: Prisma.ScholarshipInclude;
  }) {
    const { where, include } = params;

    return this.prisma.scholarship.findMany({
      where,
      include,
    });
  }
  async getScholarshipRecommendation(userId: string, take?: number) {
    console.log(userId, take);
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile: {
          select: {
            desiredStudyCountries: {
              select: {
                countryId: true,
              },
            },
            currentStudyLevelId: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found.`);
    }

    const { profile } = user;
    console.log({
      ...(take ? { take } : {}),
      where: {
        hostCountries: {
          in: JSON.stringify(
            profile['desiredStudyCountries'].map(
              (country) => country.countryId,
            ),
          ),
        },
      },
      studyLevels: {
        studyLevelId: JSON.stringify(profile['currentStudyLevelId']),
      },
    });
    const recommendation = await this.prisma.scholarship.findMany({
      ...(take ? { take } : {}),
      where: {
        hostCountries: {
          some: {
            countryId: {
              in: profile['desiredStudyCountries'].map(
                (country) => country.countryId,
              ),
            },
          },
        },
        studyLevels: {
          some: {
            studyLevelId: profile['currentStudyLevelId'],
          },
        },
      },
    });
    console.log(recommendation);
    return recommendation;
  }
  async getUpComingScholarship(take?: number) {
    const currentTimestamp = new Date().getTime();

    return this.prisma.scholarship.findMany({
      ...(take ? { take } : {}),
      where: {
        startApplicationDate: {
          gt: new Date(currentTimestamp),
        },
      },
    });
  }
  async saveScholarship(scholarshipId: string, userId: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: {
        id: scholarshipId,
      },
      include: {
        savedBy: {
          select: {
            profileId: true,
          },
        },
      },
    });
    if (!scholarship) {
      throw new BadRequestException(
        `Scholarship with id ${scholarshipId} doesn't exist`,
      );
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile: {
          select: {
            id: true,
          },
        },
      },
    });
    return this.prisma.scholarship.update({
      where: {
        id: scholarshipId,
      },
      data: {
        savedBy: {
          create: {
            profile: {
              connect: {
                id: user.profile['id'],
              },
            },
          },
        },
      },
      include: {
        savedBy: {
          select: {
            profile: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(params: { where: Prisma.ScholarshipWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.scholarship.findUnique({
      where,
    });
  }
}
