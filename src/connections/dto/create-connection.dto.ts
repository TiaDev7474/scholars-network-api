import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConnectionDto {
  @ApiProperty()
  @IsString()
  receiverId: string;
}
