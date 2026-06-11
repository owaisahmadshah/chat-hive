import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(Number),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
  NODE_MAILER_USER: z.string(),
  NODE_MAILER_PASSWORD: z.string(),
  SERVER_URL: z.string(),
  CLIENT_URL: z.string(),
});

export default () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
};

export type EnvConfig = z.infer<typeof envSchema>;
