import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  newPassword: string;
  @ApiProperty()
  token: string;
}
