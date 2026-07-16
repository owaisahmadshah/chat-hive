import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/respnose-transform.interceptor';
import { RedisIoAdapter } from './core/redis/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
