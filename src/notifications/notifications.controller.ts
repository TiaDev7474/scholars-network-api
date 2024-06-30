import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Query,
  Sse,
} from '@nestjs/common';
import { GetUser } from '../common/decorators/user.decorator';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';
import { CategoryEnum, NotificationRepository } from './notifcation.repository';
import { Notification } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  @Get()
  async getNotificationsByUser(
    @Query('category') category: CategoryEnum,
    @GetUser() user: any,
  ) {
    try {
      return this.notificationRepository.getUsersNotification(
        user.sub,
        10,
        0,
        category,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Patch(':id')
  markNotificationAsReadOrUnRead(
    @Param('id') id: string,
    @Query('mark_as') markAs: boolean,
  ) {
    try {
      return this.notificationRepository.updateNotification(id, markAs);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Get('subscribe')
  @Sse()
  subscribeToNotification(
    @GetUser() user: any,
  ): Observable<{ data: Notification }> {
    const { sub } = user;
    console.log('sse subscribe', sub);
    return this.notificationService.subscribeToNotifications(sub);
  }
}
