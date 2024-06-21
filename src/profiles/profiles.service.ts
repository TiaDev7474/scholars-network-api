import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesRepository } from './profiles.repository';
import { Prisma } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfilesRepository) {}
  //todo: handle exceptions and errors
  create(userId: string, createProfileDto: CreateProfileDto) {
    const {
      desiredStudyCountryIds,
      currentStudyLevelId,
      countryId,
      academicsInterestIds,
      ...rest
    } = createProfileDto;
    const profileData: Prisma.ProfileCreateInput = {
      id: uuidV4(),
      ...rest,
      user: {
        connect: {
          id: userId,
        },
      },
      currentStudyLevel: {
        connect: {
          id: currentStudyLevelId,
        },
      },
      country: {
        connect: {
          id: countryId,
        },
      },
      academicInterests: {
        create: academicsInterestIds.map((academicsInterestId) => ({
          academic: {
            connect: {
              id: academicsInterestId,
            },
          },
        })),
      },
      desiredStudyCountries: {
        create: desiredStudyCountryIds.map((countryId) => ({
          countryId,
        })),
      },
    };
    return this.profileRepository.create(
      {
        ...profileData,
      },
      {
        desiredStudyCountries: true,
        country: true,
        user: {
          select: {
            username: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    );
  }

  findAll() {
    return this.profileRepository.findAll({
      include: {
        country: true,
        desiredStudyCountries: true,
        user: {
          select: {
            username: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.profileRepository.findOne(id);
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    const { desiredStudyCountryIds, countryId, academicsInterestIds, ...rest } =
      updateProfileDto;

    const data: Prisma.ProfileUpdateInput = {
      ...rest,
    };
    if (desiredStudyCountryIds) {
      data['desiredStudyCountries'] = {
        deleteMany: {},
        create: desiredStudyCountryIds.map((countryId) => ({
          countryId,
        })),
      };
    }
    if (countryId) {
      data['country'] = {
        connect: {
          id: countryId,
        },
      };
    }
    if (academicsInterestIds) {
      data['academicInterests'] = {
        deleteMany: {},
        create: academicsInterestIds.map((academicsInterestId) => ({
          academic: {
            connect: {
              id: academicsInterestId,
            },
          },
        })),
      };
    }

    return this.profileRepository.update({
      where: {
        id,
      },
      data,
      include: {
        desiredStudyCountries: true,
        user: {
          select: {
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.profileRepository.remove(id);
  }
}
