import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { GetUser } from '../common/decorators/user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signupWithEmailAndPassword(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signInWithPasswordAndEmail(loginUserDto);
  }
  @Public()
  @Get('me')
  async profile(@GetUser() user: any) {
    return this.authService.getAuthenticatedUser(user.id);
  }
}
