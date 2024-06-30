import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Mail } from './interface/mail';

@Processor('emailSending')
export class MailProcessor {
  @Process('welcome')
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;
    
  }

  @Process('reset-password')
  async sendResetPasswordEmail(job: Job<Mail>) {
    const { data } = job;
  }
}
