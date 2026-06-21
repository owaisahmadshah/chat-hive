import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CACHE_TTL, REDIS_KEYS, REDIS_PROVIDER } from 'src/core/config/config';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_PROVIDER)
    private readonly redis: Redis,
  ) {}

  async setOTP(email: string, otp: string, expireSeconds?: number) {
    const key = REDIS_KEYS.otp(email);
    const attemptsKey = REDIS_KEYS.otpAttempts(email);
    const TTL = expireSeconds || CACHE_TTL.OTP_DEFAULT_SECONDS;

    await this.redis
      .multi()
      .set(key, otp, 'EX', TTL)
      .set(attemptsKey, 0, 'EX', TTL)
      .exec();
  }

  async verifyOTP(
    email: string,
    submittedOTP: string,
    maxAttempts = 5,
  ): Promise<boolean> {
    const key = REDIS_KEYS.otp(email);
    const attemptsKey = REDIS_KEYS.otpAttempts(email);

    const attempts = await this.redis.incr(attemptsKey);

    const storedOTP = await this.redis.get(key);

    if (!storedOTP) {
      return false;
    }

    if (attempts >= maxAttempts) {
      await this.redis.del([key, attemptsKey]);
      return false;
    }

    if (storedOTP === submittedOTP) {
      await this.redis.del([key, attemptsKey]);
      return true;
    }

    return false;
  }
}
