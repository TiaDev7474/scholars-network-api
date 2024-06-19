import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(params: { email: string; password: string; username: string }) {
    const { email, password, username } = params;
    try {
      const foundUser = await this.findUserByEmail(email);
      if (foundUser) {
        return new ForbiddenException(FORBIDDEN_MESSAGE);
      }
      //Todo hash the password
      return this.prisma.user.create({
        data: {
          id: 'uuid',
          email: email,
          password: password,
          username: username,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  private async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
