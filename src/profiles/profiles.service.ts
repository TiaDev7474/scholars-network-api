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
    const profileData: Prisma.ProfileCreateInput = {
      id: uuidV4(),
      ...createProfileDto,
      user: {
        connect: {
          id: userId,
        },
      },
    };
    return this.profileRepository.create(profileData);
  }

  findAll() {
    return this.profileRepository.findAll({});
  }

  findOne(id: string) {
    return this.profileRepository.findOne(id);
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return this.profileRepository.update({
      where: {
        id,
      },
      data: {
        ...updateProfileDto,
      },
    });
  }

  remove(id: string) {
    return this.profileRepository.remove(id);
  }
}
