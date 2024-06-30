import { OnQueueActive , OnQueueCompleted , Process , Processor } from "@nestjs/bull";
import { NotificationRepository } from './notifcation.repository';
import { Job } from 'bull';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';
import { Notification } from '@prisma/client';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationService: NotificationsService,
  ) {}

  @Process('create-notification')
  async createNotification(job: Job<CreateNotificationDto>) {
    const { data } = job;
    console.log('Processing', job.id, job.data);
    return await this.notificationRepository.createNotification(data);
  }
  @OnQueueCompleted()
  async handler(job: Job, result: Notification) {
    console.log(
      `Job ${job.id} of type ${job.name} with data ${job.data} completed...`,
    );
    console.log('result', result);
    return await this.notificationService.sendNotification(result.toId, result);
  }
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
