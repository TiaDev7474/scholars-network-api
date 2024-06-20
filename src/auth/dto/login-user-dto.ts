import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  password: string;
  @IsEmail()
  email: string;
}
