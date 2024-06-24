import { Injectable } from '@nestjs/common';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { ConnectionsRepository } from './connections.repository';
import { FriendRequestStatus, Prisma } from '@prisma/client';

@Injectable()
export class ConnectionsService {
  constructor(private readonly connectionRepository: ConnectionsRepository) {}

  async getUsersConnections(params: {
    page: number;
    limit: number;
    userId: string;
  }) {
    const { page = 1, limit = 10, userId } = params;
    const where: Prisma.ConnectionWhereInput = {
      userId: userId,
    };
    return this.connectionRepository.getUsersConnections({
      page: page,
      limit: limit,
      where: where,
    });
  }

  async sendConnectionRequest(params: {
    senderId: string;
    receiverId: string;
  }) {
    const { senderId, receiverId } = params;
    return this.connectionRepository.sendConnectionRequest({
      senderId,
      receiverId,
    });
  }
  async getSentRequests(params: {
    page: number;
    limit: number;
    userId: string;
  }) {
    const { page = 1, limit = 10, userId } = params;
    return this.connectionRepository.getRequests({
      page: page,
      limit: limit,
      where: {
        senderId: userId,
      },
      include: {
        receiver: {
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
    });
  }
  async getReceivedRequests(params: {
    page: number;
    limit: number;
    userId: string;
  }) {
    const { page, limit, userId } = params;
    return this.connectionRepository.getRequests({
      page: page,
      limit: limit,
      where: {
        receiverId: userId,
      },
      include: {
        sender: {
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
    });
  }
  async acceptOrDeclineRequest(params: {
    receiverId: string;
    senderId: string;
    action: FriendRequestStatus;
  }) {
    const { receiverId, senderId, action } = params;
    return this.connectionRepository.acceptOrDeclineFriendRequest({
      receiverId,
      senderId,
      action,
    });
  }
  create(createConnectionDto: CreateConnectionDto) {
    return 'This action adds a new connection';
  }

  findAll() {
    return `This action returns all connections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} connection`;
  }

  update(id: number, updateConnectionDto: UpdateConnectionDto) {
    return `This action updates a #${id} connection`;
  }

  remove(id: number) {
    return `This action removes a #${id} connection`;
  }
}
