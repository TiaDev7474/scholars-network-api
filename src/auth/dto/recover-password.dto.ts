import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordDto {
  @ApiProperty()
  email: string;
}
