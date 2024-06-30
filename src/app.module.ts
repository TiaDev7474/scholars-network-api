import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './common/database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ProfilesModule } from './profiles/profiles.module';
import * as process from 'process';
import { MinioModule } from './common/lib/minio/minio.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { ConnectionsModule } from './connections/connections.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ProfilesModule,
    MinioModule,
    ScholarshipsModule,
    ConnectionsModule,
    ChatModule,
    NotificationsModule,
  ],
  providers: [],
})
export class AppModule {}
