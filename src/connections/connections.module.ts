import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { ConnectionsRepository } from './connections.repository';
import { ChatModule } from '../chat/chat.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ChatModule, NotificationsModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ConnectionsRepository],
})
export class ConnectionsModule {}
