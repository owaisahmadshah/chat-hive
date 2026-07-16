import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parseCookie } from 'cookie';
import {
  JWTPayload,
  jwtPayloadSchema,
} from 'src/shared/types/jwt-payload.type';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractToken(client);

    if (!token) throw new WsException('Access token not found');

    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token);
      client.user = jwtPayloadSchema.parse(payload);
    } catch {
      throw new WsException('Invalid access token');
    }

    return true;
  }

  private extractToken(client: Socket): string | undefined {
    const rawCookie = client.handshake.headers.cookie;
    if (!rawCookie) return undefined;

    try {
      const cookies = parseCookie(rawCookie);
      return cookies.access_token;
    } catch {
      return undefined;
    }
  }
}
