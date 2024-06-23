import { FriendRequestStatus } from '@prisma/client';
import { IsEnum , IsString } from "class-validator";

export class RequestResponseDto {
  @IsEnum(FriendRequestStatus)
  action: FriendRequestStatus;
  @IsString()
  senderId: string;
}
