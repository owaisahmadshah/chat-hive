import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';

interface HttpExceptionResponse {
  message: string | string[];
  [key: string]: unknown;
}

@Catch()
export class WsCatchAllFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      const message: string | string[] =
        typeof response === 'string'
          ? response
          : (response as HttpExceptionResponse).message;

      client.emit('exception', {
        status: 'error',
        message: Array.isArray(message) ? message[0] : message,
      });
      return;
    }

    if (exception instanceof WsException) {
      client.emit('exception', {
        status: 'error',
        message: exception.message,
      });
      return;
    }

    console.error('[WS Unhandled Exception]', exception);
    client.emit('exception', {
      status: 'error',
      message: 'Something went wrong',
    });
  }
}
