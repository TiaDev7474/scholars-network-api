import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/database/prisma.service';
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { DatabaseException } from '../common/exceptions/exception';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.ProfileCreateInput, include: Prisma.ProfileInclude) {
    try {
      return this.prisma.profile.create({
        data,
        include,
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }

 async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProfileWhereUniqueInput;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput;
    include?: Prisma.ProfileInclude;
  }) {
    try {
      return this.prisma.profile.findMany({
        ...params,
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: Prisma.ProfileWhereUniqueInput['id']) {
    try {
      return this.prisma.profile.findUnique({
        where: {
          id,
        },
        include: {
          country: true,
          user: {
            select: {
              username: true,
              createdAt: true,
              email: true,
              updatedAt: true,
            },
          },
          desiredStudyCountries: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }

 async update(params: {
    where: Prisma.ProfileWhereUniqueInput;
    data: Prisma.ProfileUpdateInput;
    include: Prisma.ProfileInclude;
  }) {
    const { where, data, include } = params;
    try {
      return this.prisma.profile.update({
        data,
        where,
        include,
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async remove(id: Prisma.ProfileWhereUniqueInput['id']) {
    try {
      return this.prisma.profile.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async getAllCountry() {
    console.log("I am in country repo")
    const countries = await this.prisma.country.findMany({
    })
    return countries

  }
  async getAllAcademics(){
     return this.prisma.academics.findMany()
  }
  async getAllStudyLevel() {
    return this.prisma.studyLevel.findMany()
  }

}
