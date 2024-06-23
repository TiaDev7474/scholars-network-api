import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { Conversation, Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(params: {
    data: Prisma.MessageCreateInput;
    include: Prisma.MessageInclude;
  }): Promise<Message> {
    try {
      const { data, include } = params;
      return await this.prisma.message.create({ data, include });
    } catch (error) {
      throw new HttpException(
        `Failed to create message: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessagesByConversationId(
    conversationId: string,
  ): Promise<Message[]> {
    try {
      return await this.prisma.message.findMany({
        where: { conversationId },
        include: { sender: true, receiver: true },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to fetch messages: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createConversation(params: {
    userId: string;
    friendId: string;
  }): Promise<Conversation> {
    const { userId, friendId } = params;
    try {
      return await this.prisma.conversation.create({
        data: {
          participants: {
            create: {
              participantA: {
                connect: {
                  id: userId,
                },
              },
              participantB: {
                connect: {
                  id: friendId,
                },
              },
            },
          },
        },
        include: {
          participants: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create conversation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserConversation(params: {
    userId: string;
  }): Promise<Conversation[]> {
    try {
      const { userId } = params;
      return await this.prisma.conversation.findMany({
        where: {
          OR: [
            { participants: { participantAId: userId } },
            { participants: { participantBId: userId } },
          ],
        },
        include: {
          messages: {
            take: 1,
            orderBy: {
              sentAt: 'desc',
            },
          },
          participants: {
            select: {
              participantA: {
                select: {
                  id: true,
                  username: true,
                  profile: {
                    select: {
                      id: true,
                      profilePicture: true,
                    },
                  },
                },
              },
              participantB: {
                select: {
                  id: true,
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
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Failed to fetch user conversations: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async checkIfConversationExists(params: {
    userId: string;
    friendId: string;
  }): Promise<Conversation> {
    const { userId, friendId } = params;
    return this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participants: {
              participantAId: userId,
              participantBId: friendId,
            },
          },
          {
            participants: {
              participantAId: friendId,
              participantBId: userId,
            },
          },
        ],
      },
    });
  }
}
