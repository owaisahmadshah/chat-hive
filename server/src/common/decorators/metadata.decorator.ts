import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserSession, Platform } from 'shared';

export const Metadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CreateUserSession => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const deviceName = request.headers['user-agent'] || 'unknown';

    const deviceId = request.ip || '';

    const platformHeader = request.headers['x-platform'] as string;
    const allowedPlatforms: Platform[] = ['web', 'ios', 'android', 'desktop'];

    const platform: Platform = allowedPlatforms.includes(
      platformHeader as Platform,
    )
      ? (platformHeader as Platform)
      : 'web';

    return {
      deviceId,
      deviceName,
      platform,
    };
  },
);
