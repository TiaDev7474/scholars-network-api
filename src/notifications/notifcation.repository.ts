import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

export enum CategoryEnum {
  'read',
  'unread',
  'all',
}
@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsersNotification(
    userId: string,
    take: number = 10,
    skip: number = 0,
    category: CategoryEnum,
  ) {
    return this.prisma.notification.findMany({
      where: {
        toId: userId,
        ...(category == CategoryEnum.all
          ? {}
          : { isRead: category == CategoryEnum.read }),
      },
      take,
      skip,
      include: {
        from: {
          select: {
            id: true,
            profile: {
              select: {
                id: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });
  }
  async createNotification(data: CreateNotificationDto) {
    const { from, to, type, source, content } = data;
    return this.prisma.notification.create({
      data: {
        from: {
          connect: {
            id: from,
          },
        },
        to: {
          connect: {
            id: to,
          },
        },
        content,
        type,
        sourceId: source,
      },
      include: {
        from: {
          select: {
            id: true,
            profile: {
              select: {
                id: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });
  }
  updateNotification(notificationId: string, markAs: boolean) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: markAs,
      },
      include: {
        from: {
          select: {
            id: true,
            profile: {
              select: {
                id: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });
  }
  updateAllNotification(markAs: boolean, ids: string[]) {
    return this.prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isRead: markAs,
      },
    });
  }
}
