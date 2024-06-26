import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository'; // Adjust the import path as per your project structure
import { Conversation, Message } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    conversationId: string,
  ): Promise<Message> {
    try {
      const message = await this.messageRepository.createMessage({
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
          content,
          conversation: {
            connect: {
              id: conversationId,
            },
          },
        },
        include: {
          sender: {
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
        conversationId,
      });
      return message;
    } catch (error) {
      throw new HttpException(
        `Failed to send message: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessagesByConversationId(
    conversationId: string,
  ): Promise<Conversation> {
    try {
      return await this.messageRepository.getMessagesByConversationId(
        conversationId,
      );
    } catch (error) {
      throw new HttpException(
        `Failed to fetch messages: ${error.message || 'Internal Server Error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      console.log(userId);
      return await this.messageRepository.getUserConversation({ userId });
    } catch (error) {
      throw new WsException(
        `Failed to fetch user conversations: ${error.message || 'Internal Server Error'}`,
      );
    }
  }
  async createConversation(
    userId: string,
    friendId: string,
  ): Promise<Conversation> {
    try {
      return await this.messageRepository.createConversation({
        userId,
        friendId,
      });
    } catch (error) {
      throw new HttpException(
        `Failed to create conversation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async checkIfConversationExists(
    userId: string,
    friendId: string,
  ): Promise<Conversation> {
    try {
      return this.messageRepository.checkIfConversationExists({
        userId,
        friendId,
      });
    } catch (error) {
      throw new HttpException(
        `Failed to check conversation: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
