import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail.service';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
    /*MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAILER_HOST'),
          secure: true,
          auth: {
            user: config.get<string>('MAILER_USER'),
            pass: config.get<string>('MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: 'No reply noreply@gmail.com',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),*/
  ],
  exports: [MailService],
})
export class MailModule {}
