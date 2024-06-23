import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { DatabaseException } from '../common/exceptions/exception';
import { FriendRequestStatus } from '@prisma/client';

@Injectable()
export class ConnectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsersConnections(params: { userId: string }) {}

  async getConnectionRequest() {}

  async getRequestSent() {}

  async sendConnectionRequest(params: {
    senderId: string;
    receiverId: string;
  }) {
    try {
      const { receiverId, senderId } = params;
      const existingConnection = await this.prisma.friendRequest.findFirst({
        where: {
          senderId,
          receiverId,
        },
      });
      if (existingConnection) {
        throw new HttpException(
          'Connection Request already exists',
          HttpStatus.CONFLICT,
        );
      }
      await this.prisma.friendRequest.create({
        data: {
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
        include: {
          receiver: {
            select: {
              receivedFriendRequests: {
                select: {
                  senderId: true,
                },
              },
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new BadRequestException(
          `Validation error: ${e.message}, stack: ${e.stack}`,
        );
      } else if (e instanceof PrismaClientUnknownRequestError) {
        throw new DatabaseException(e);
      }
      throw new InternalServerErrorException();
    }
  }
  async acceptFriendRequest(params: { receiverId: string; senderId: string }) {
    const { senderId, receiverId } = params;
    const existingConnection = await this.prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
      },
    });
    if (!existingConnection) {
      throw new HttpException(
        'Connection Request already do not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
