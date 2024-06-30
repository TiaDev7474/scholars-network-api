import {
  Controller ,
  Get , HttpException , HttpStatus ,
  InternalServerErrorException ,
  Param ,
  Patch ,
  Query ,
  Res ,
  Sse
} from "@nestjs/common";
import { GetUser } from '../common/decorators/user.decorator';
import { EventObject, NotificationsService } from './notifications.service';
import { interval, map, Observable } from 'rxjs';
import { CategoryEnum, NotificationRepository } from './notifcation.repository';
import { Response } from 'express';

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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch(':id')
  markNotificationAsReadOrUnRead(
    @Param('id') id: string,
    @Query('mark_as') markAs: boolean,
  ) {
    try {
      return this.notificationRepository.updateNotification(id, markAs);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch()
  markAllNotificationAsRead(@Query('ids') notificationIds: string[]) {
    try {
      return this.notificationRepository.updateAllNotification(
        true,
        notificationIds,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Sse('subscribe')
  subscribeToNotification(
    @GetUser() user: any,
    @Res() response: Response,
  ): Observable<MessageEvent> {
    this.notificationService.addUser(user.sub);
    response.on('close', () => {
      this.notificationService.removeUser(user.sub);
    });
    return this.notificationService.subscribeToNotification(user.sub);
  }

  @Get('test')
  @Sse('sse')
  sse(): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
