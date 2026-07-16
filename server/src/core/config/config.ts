export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';
export const REDIS_PROVIDER = 'REDIS_PROVIDER';
export const REDIS_PUB_PROVIDER = 'REDIS_PUB_PROVIDER';
export const REDIS_SUB_PROVIDER = 'REDIS_SUB_PROVIDER';

export const REDIS_KEYS = {
  otp: (email: string) => `otp:email:${email}`,
  otpAttempts: (email: string) => `otp:attempts:${email}`,
  userPresence: (userId: string) => `presence:user:${userId}`,
  chatRoom: (chatId: string) => `presence:chat:${chatId}`,
} as const;

export const CACHE_TTL = {
  OTP_DEFAULT_SECONDS: 300,
  PRESENCE_DEFAULT_SECONDS: 86400,
} as const;
