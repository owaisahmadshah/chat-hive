import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { INestApplicationContext } from '@nestjs/common';
import { REDIS_PUB_PROVIDER, REDIS_SUB_PROVIDER } from '../config/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  connectToRedis(): void {
    const pubClient = this.app.get<Redis>(REDIS_PUB_PROVIDER);
    const subClient = this.app.get<Redis>(REDIS_SUB_PROVIDER);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['user-id', 'Authorization', 'Content-Type'],
      },
    }) as Server;

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }

    return server;
  }
}
