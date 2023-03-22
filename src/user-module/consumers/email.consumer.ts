import { MailerService } from '@nest-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}
  @Process('register')
  async registerEmail(job: Job<unknown>) {
    console.log('job', job.data);
    await this.mailerService.sendMail({
      to: job.data['to'],
      subject: 'Welcome to my Website',
      template: './welcome',
      context: {
        name: job.data['name'],
      },
    });
    console.log('send success');
  }
}
