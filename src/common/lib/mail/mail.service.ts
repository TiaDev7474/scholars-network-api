import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Mail } from './interface/mail';

@Injectable()
export class MailService {
  constructor(@InjectQueue('emailSending') private readonly emailQue: Queue) {}
  async sendWelcomeEmail(data: Mail) {
    const job = await this.emailQue.add('welcome', { data });
    return { jobId: job.id };
  }
  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQue.add('reset-password', { data });
    return { jobId: job.id };
  }
}
