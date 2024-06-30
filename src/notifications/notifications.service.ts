import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import Redis from 'ioredis';
import { filter, fromEventPattern, map, Observable } from 'rxjs';
import { Notification } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private redisSubscriber: Redis;
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}
  onModuleInit(): void {
    this.redisSubscriber = this.redisClient;
    this.redisSubscriber.subscribe('notifications');
  }
  onModuleDestroy(): void {
    this.redisSubscriber.unsubscribe();
    this.redisSubscriber.quit();
    this.redisClient.quit();
  }

  private generatePattern(userId: string): RegExp {
    return new RegExp(`notification${userId}`);
  }

  // Send a notification to a specific user
  async sendNotification(
    userId: string,
    notification: Notification,
  ): Promise<void> {
    const message = JSON.stringify(notification);
    await this.redisClient.publish('notifications', message);
  }
  subscribeToNotifications(userId: string): Observable<{ data: Notification }> {
    const pattern = this.generatePattern(userId);

    // Convert Redis pub/sub messages to an observable stream
    const notifications = fromEventPattern<[string, string]>(
      (handler) => this.redisSubscriber.on('message', handler),
      (handler) => this.redisSubscriber.off('message', handler),
    );

    console.log('notifications', notifications);
    // Filter and map the stream to process notifications for the specific user
    return notifications.pipe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter(([channel, _]) => channel === 'notifications'),
      map(([, message]) => JSON.parse(message) as Notification),
      filter((notification) =>
        pattern.test(`notifications:${notification.toId}`),
      ),
      map((notification) => ({ data: notification })),
    );
  }
  async createNotification(data: CreateNotificationDto) {
    const job = await this.notificationsQueue.add('create-notification', data);
    return { jobId: job.id };
  }
}
