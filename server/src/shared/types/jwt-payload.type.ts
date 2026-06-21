import { z } from 'zod';

export const jwtPayloadSchema = z
  .object({
    sub: z.string(),
    email: z.string().email(),
    username: z.string(),
    sessionId: z.string(),
  })
  .strip();

export interface JWTPayload {
  sub: string;
  email: string;
  username: string;
  sessionId: string;
}
