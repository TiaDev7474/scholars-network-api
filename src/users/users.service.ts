import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';
import {
  DatabaseException,
  UserNotFoundException,
} from '../common/exceptions/exception';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    //todo: return user profileId
    try {
      return this.usersRepository.findAll({
        ...params,
      });
    } catch (e) {
      if (e instanceof DatabaseException) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw e;
    }
  }
  async create(params: {
    email: string;
    password: string;
    username: string;
  }): Promise<User> {
    try {
      return this.usersRepository.save(params);
    } catch (e) {
      if (e instanceof DatabaseException) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw e;
    }
  }
  async findById(params: { id: string }): Promise<User> {
    try {
      return this.usersRepository.findById(params);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UserNotFoundException(
          `User with id ${params.id} is not found`,
        );
      }
    }
  }
  async update(): Promise<User> {
    return null;
  }
  async delete() {}
}
