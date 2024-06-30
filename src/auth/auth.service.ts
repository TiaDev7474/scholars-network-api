import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as argon2 from 'argon2';
import { v4 as uuidV4 } from 'uuid';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  EmailAlreadyInUseException,
  UserNotFoundException,
} from '../common/exceptions/exception';
import { RedisRepository } from '../common/lib/redis/redis.repository';
import { RedisPrefixEnum } from '../common/lib/redis/enums/redis.prifix.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private redisRepository: RedisRepository,
  ) {}

  async signInWithPasswordAndEmail(params: {
    email: string;
    password: string;
  }) {
    const { email, password } = params;
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'Authentication failed, Email / password is incorrect',
      );
    }
    const passwordValid = await this.verifyIsValidPassword(
      user.password,
      password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException(
        'Authentication failed, Password incorrect',
      );
    }
    return this.generateTokenAndRefreshToken(user);
  }
  async signupWithEmailAndPassword(params: {
    email: string;
    password: string;
    username: string;
  }) {
    const { email, password, username } = params;
    try {
      const user = await this.usersRepository.findUserByEmail(email);
      if (user) {
        throw new EmailAlreadyInUseException();
      }
      const hashedPassword = await this.hashPassword(password);
      const newUser = {
        email: email,
        password: hashedPassword,
        username,
      };
      return this.usersRepository.save(newUser);
    } catch (e) {
      if (e instanceof EmailAlreadyInUseException) {
        throw new BadRequestException(
          'This is email is already associated with an account',
        );
      }
      throw new InternalServerErrorException();
    }
  }
  async requestPasswordRecovery(email: string) {
    try {
      const user = await this.usersRepository.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('Email not found');
      }
      const token = uuidV4();
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.RESET_TOKEN,
        token,
        user.id,
        60,
      );
      return {
        token: token,
        user: user,
      };
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
  async validatePasswordRecoveryToken(token: string) {
    const userId = await this.redisRepository.get(
      RedisPrefixEnum.RESET_TOKEN,
      token,
    );
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }
    return userId;
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const userId = await this.validatePasswordRecoveryToken(token);
      const hashedPassword = await this.hashPassword(newPassword);
      await this.usersRepository.updateOne({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      await this.redisRepository.delete(RedisPrefixEnum.RESET_TOKEN, token);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
  async getAuthenticatedUser(id: string) {
    try {
      return this.usersRepository.findById({ id });
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  private async verifyIsValidPassword(
    hashed_password: string,
    password: string,
  ): Promise<boolean> {
    return argon2.verify(hashed_password, password);
  }
  private async hashPassword(password: string) {
    return argon2.hash(password);
  }

  private async generateTokenAndRefreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      userId: user.id,
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload),
    };
  }
}
