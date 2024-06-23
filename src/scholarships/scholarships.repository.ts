import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { Prisma } from '@prisma/client';
import { share } from 'rxjs';

@Injectable()
export class ScholarshipsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(params: {
    data: Prisma.ScholarshipCreateInput;
    include: Prisma.ScholarshipInclude;
  }) {
    const { data } = params;
    return this.prisma.scholarship.create({
      data,
    });
  }
  async update(params: {
    where: Prisma.ScholarshipWhereUniqueInput;
    data: Prisma.ScholarshipUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.scholarship.update({
      where,
      data,
    });
  }
  async remove(params: { where: Prisma.ScholarshipWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.scholarship.delete({
      where,
    });
  }
  async findAll(params: { where: Prisma.ScholarshipWhereInput }) {
    const { where } = params;

    return this.prisma.scholarship.findMany({
      where,
    });
  }
  async getScholarshipRecommendation(userId: string, take?: number) {
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

    return this.prisma.scholarship.findMany({
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
    return this.prisma.scholarship.update({
      where: {
        id: scholarshipId,
      },
      data: {
        savedBy: {
          create: {
            profile: {
              connect: {
                id: userId,
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
