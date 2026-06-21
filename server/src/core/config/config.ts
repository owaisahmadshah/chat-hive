export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';
export const REDIS_PROVIDER = 'REDIS_PROVIDER';

export const REDIS_KEYS = {
  otp: (email: string) => `otp:email:${email}`,
  otpAttempts: (email: string) => `otp:attempts:${email}`,
} as const;

export const CACHE_TTL = {
  OTP_DEFAULT_SECONDS: 300,
} as const;
