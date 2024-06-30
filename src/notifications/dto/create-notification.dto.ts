import { NotificationTypeEnum } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsString()
  content: string;
  @IsString()
  source: string;
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;
}
