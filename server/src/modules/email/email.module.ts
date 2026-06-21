import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../core/config/env';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvConfig, true>) => ({
        transport: {
          service: 'gmail',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('NODE_MAILER_USER', { infer: true }),
            pass: configService.get('NODE_MAILER_PASSWORD', { infer: true }),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
