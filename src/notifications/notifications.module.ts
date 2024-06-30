import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { RedisFactoryProvider } from '../common/provider/redis.factory';
import { BullModule } from '@nestjs/bull';
import { NotificationRepository } from './notifcation.repository';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [
    NotificationsService,
    RedisFactoryProvider,
    NotificationRepository,
    NotificationsProcessor,
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
