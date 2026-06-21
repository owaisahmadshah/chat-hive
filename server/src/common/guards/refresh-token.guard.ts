import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  JWTPayload,
  jwtPayloadSchema,
} from 'src/shared/types/jwt-payload.type';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Refresh token not found');

    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token);
      request['user'] = jwtPayloadSchema.parse(payload);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    return (request?.cookies?.refresh_token ?? undefined) as string | undefined;
  }
}
