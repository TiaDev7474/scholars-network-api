import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsGuard } from '../auth/guards/ws/ws.guard';
import { UseGuards } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server;

  @UseGuards(WsGuard)
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  @UseGuards(WsGuard)
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:list')
  async getConversationList(@ConnectedSocket() client: Socket) {
    const { user } = client.data;
    try {
      const conversations = await this.chatService.getUserConversations(
        user.sub,
      );
      client.emit('chat:conversation:list:loaded', {
        conversations: conversations,
      });
    } catch (error) {
      client.emit('chat:conversation:list:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:subscribe')
  async subscribeToAllConversation(@ConnectedSocket() client: Socket) {
    const { user } = client.data;
    await client.join(user.sub);
    try {
      const conversations: Conversation[] =
        await this.chatService.getUserConversations(user.sub);
      await Promise.all(
        conversations?.map(async (conversation) => {
          await client.join(conversation.id);
        }),
      );
      client.emit('chat:conversation:subscribe:success');
    } catch (error) {
      client.emit('chat:conversation:subscribe:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:message:send')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const { content, conversationId, receiverId } = createMessageDto;

    try {
      const message = await this.chatService.sendMessage(
        user.sub,
        receiverId,
        content,
        conversationId,
      );
      console.log(message);
      client.emit('chat:message:sent', { status: 'success', message });

      // Broadcast to the conversation room
      this.server.to(conversationId).emit('chat:message:new', {
        message: message,
      });
    } catch (error) {
      client.emit('chat:message:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:join')
  async joinConversation(
    @MessageBody() joinConversationDto: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = joinConversationDto;

    await client.join(conversationId);
    const user = client.data.user;
    await client.join(user.sub);
    try {
      const conversationWithMessages =
        await this.chatService.getMessagesByConversationId(conversationId);
      client.emit('chat:conversation:messages', {
        conversation: conversationWithMessages,
      });
      this.server.to(conversationId).emit('chat:conversation:user:joined', {
        username: user.username,
      });
    } catch (error) {
      client.emit('chat:conversation:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:typing')
  async indicateUserTypingMessage(
    @MessageBody() sendingMessageDto: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const { conversationId } = sendingMessageDto;
    try {
      this.server
        .to(conversationId)
        .except(user.sub)
        .emit('chat:conversation:typing', {
          message: `${user.username} is typing... `,
        });
    } catch (error) {
      client.emit('chat:conversation:typing:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:create')
  async createConversation(
    @MessageBody() createConversationDto: CreateConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;
    const { friendId } = createConversationDto;
    try {
      const conversation = await this.chatService.createConversation(
        user.sub,
        friendId,
      );
      client.emit('chat:conversation:created', { conversation: conversation });
    } catch (error) {
      client.emit('chat:conversation:create:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
}
