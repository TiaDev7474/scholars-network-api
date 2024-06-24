import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import {
  DatabaseException,
  EmailAlreadyInUseException,
} from '../common/exceptions/exception';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { Prisma, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(params: { id: string }): Promise<User> {
    const { id } = params;
    try {
      const user = this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          profile: {
            select: {
              id: true,
              profilePicture: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      return this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async destroy(params: { id: string }) {
    try {
      await this.prisma.user.delete({
        where: {
          id: params.id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }

  async updateOne(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    try {
      return this.prisma.user.update({
        where,
        data,
      });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }

  async save(params: { email: string; password: string; username: string }) {
    const { email, password, username } = params;
    try {
      const foundUser = await this.findUserByEmail(email);
      if (foundUser) {
        throw new EmailAlreadyInUseException();
      }
      return this.prisma.user.create({
        data: {
          id: uuidv4(),
          email: email,
          password: password,
          username: username,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
