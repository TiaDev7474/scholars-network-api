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
import { FriendRequestStatus, Prisma } from '@prisma/client';

@Injectable()
export class ConnectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsersConnections(params: {
    page: number;
    limit: number;
    where: Prisma.ConnectionWhereInput;
  }) {
    const { page = 1, limit = 10, where } = params;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
      const totalCount = this.prisma.connection.count({
        where,
      });

      const userConnections = await this.prisma.connection.findMany({
        where,
        include: {
          friend: {
            select: {
              username: true,
              profile: {
                select: {
                  id: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
        take,
        skip,
      });
      return {
        totalCount,
        page,
        limit,
        connections: userConnections,
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching connections.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
        return new HttpException(
          'Connection Request already exists',
          HttpStatus.CONFLICT,
        );
      }
      return await this.prisma.friendRequest.create({
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
  async getRequests(params: {
    page: number;
    limit: number;
    where: Prisma.FriendRequestWhereInput;
    include: Prisma.FriendRequestInclude;
  }) {
    const { page = 1, limit = 10, where, include } = params;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    return this.prisma.friendRequest.findMany({
      where,
      include,
      take,
      skip,
    });
  }
  async acceptOrDeclineFriendRequest(params: {
    receiverId: string;
    senderId: string;
    action: FriendRequestStatus;
  }) {
    const { senderId, receiverId, action } = params;

    try {
      const existingFriendRequest = await this.prisma.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      });
      if (!existingFriendRequest) {
        return new HttpException(
          'Friend request not found.',
          HttpStatus.NOT_FOUND,
        );
      }
      if (action == FriendRequestStatus.ACCEPTED) {
        if (existingFriendRequest['status'] == FriendRequestStatus.ACCEPTED) {
          return new HttpException(
            'Friend request already accepted.',
            HttpStatus.CONFLICT,
          );
        }
        await this.initializeConnection({
          userId: receiverId,
          friendId: senderId,
        });
      }
      return await this.prisma.friendRequest.update({
        data: {
          status:
            action == FriendRequestStatus.ACCEPTED
              ? FriendRequestStatus.ACCEPTED
              : FriendRequestStatus.DECLINED,
        },
        where: {
          senderId_receiverId: {
            senderId,
            receiverId,
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred while accepting the friend request.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async initializeConnection(params: { userId: string; friendId: string }) {
    const { userId, friendId } = params;

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connections: {
          create: {
            friend: {
              connect: {
                id: friendId,
              },
            },
          },
        },
      },
    });
    await this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        connections: {
          create: {
            friend: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }
}
