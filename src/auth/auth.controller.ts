import { Body , Controller , Get , Post , Query } from "@nestjs/common";
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { GetUser } from '../common/decorators/user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.signupWithEmailAndPassword(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signInWithPasswordAndEmail(loginUserDto);
  }

  @Public()
  @Post('recover-password')
  async requestPasswordRecovery(
    @Body() recoverPasswordDto: RecoverPasswordDto,
  ) {
    return this.authService.requestPasswordRecovery(recoverPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  async validateResetToken(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
  @Get('me')
  async profile(@GetUser() user: any) {
    return this.authService.getAuthenticatedUser(user.id);
  }
}
