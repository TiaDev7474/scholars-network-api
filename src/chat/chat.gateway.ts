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
import { CreateMessageDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { CreateConversationDto } from "./dto/create-conversation.dto";

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server;

  @UseGuards(WsGuard)
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const user = client.data.user;
    const conversations = await this.chatService.getUserConversations(user.sub);
    conversations.forEach((conversation) => {
      client.join(conversation.id);
    });
  }

  @UseGuards(WsGuard)
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('chat:conversation:list')
  async getConversationList(@ConnectedSocket() client: Socket) {
    try {
      const user = client.data.user;
      const conversations = await this.chatService.getUserConversations(
        user.sub,
      );
      return { conversations };
    } catch (error) {
      client.emit('chat:conversation:list:error', {
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

      client.emit('chat:message:sent', { status: 'success', message });

      // Broadcast to the conversation room
      this.server.to(conversationId).emit('chat:message:new', {
        from: user.sub,
        content: message.content,
        sentAt: message.sentAt,
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
    const user = client.data.user;
    try {
      const messages =
        await this.chatService.getMessagesByConversationId(conversationId);
      client.emit('chat:conversation:messages', messages);
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
      client.emit('chat:conversation:created', conversation);
    } catch (error) {
      client.emit('chat:conversation:create:error', {
        status: 'error',
        error: error.message,
      });
    }
  }
}
