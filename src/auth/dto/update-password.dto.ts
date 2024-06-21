import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty()
  newPassword: string;
  @ApiProperty()
  token: string;
}
