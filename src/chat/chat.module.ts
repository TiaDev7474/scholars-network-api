import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageRepository } from './message.repository';

@Module({
  controllers: [],
  providers: [ChatService, MessageRepository, ChatGateway],
  exports: [MessageRepository],
})
export class ChatModule {}
