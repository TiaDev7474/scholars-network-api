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
  create(data: Prisma.ProfileCreateInput) {
    try {
      return this.prisma.profile.create({
        data,
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

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProfileWhereUniqueInput;
    where?: Prisma.ProfileWhereInput;
    orderBy?: Prisma.ProfileOrderByWithRelationInput;
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

  findOne(id: Prisma.ProfileWhereUniqueInput['id']) {
    try {
      return this.prisma.profile.findUnique({
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

  update(params: {
    where: Prisma.ProfileWhereUniqueInput;
    data: Prisma.ProfileUpdateInput;
  }) {
    const { where, data } = params;
    try {
      return this.prisma.profile.update({
        data,
        where,
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
  remove(id: Prisma.ProfileWhereUniqueInput['id']) {
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
}