import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  EmailAlreadyInUseException,
  UserNotFoundException,
} from '../common/exceptions/exception';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
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
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload),
    };
  }
}