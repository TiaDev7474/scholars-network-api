import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinConversationDto {
  @ApiProperty()
  @IsString()
  conversationId: string;
}
