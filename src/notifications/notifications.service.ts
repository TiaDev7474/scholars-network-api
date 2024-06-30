import {
  Injectable,
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { Notification } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EventObject {
  eventSubject: Subject<MessageEvent>;
}

@Injectable()
export class NotificationsService {
  private readonly allSubscribedUsers: Map<string, EventObject> = new Map();
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  subscribeToNotification(userId: string) {
    return this.allSubscribedUsers.get(userId).eventSubject.asObservable();
  }

  async sendNotification(
    userId: string,
    notification: Notification,
  ): Promise<void> {
    if (this.allSubscribedUsers.has(userId)) {
      this.allSubscribedUsers.get(userId).eventSubject.next({
        data: notification,
      } as MessageEvent);
    }
  }

  removeUser(id: string) {
    if (this.allSubscribedUsers.has(id)) {
      this.allSubscribedUsers.delete(id);
    }
  }
  addUser(id: string) {
    if (!this.allSubscribedUsers.has(id)) {
      this.allSubscribedUsers.set(id, {
        eventSubject: new Subject<MessageEvent>(),
      });
    }
  }
  async createNotification(data: CreateNotificationDto) {
    const job = await this.notificationsQueue.add('create-notification', data);
    return { jobId: job.id };
  }
}
