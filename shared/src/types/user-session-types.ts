import { z } from "zod";

export const platformSchema = z.enum(["web", "mobile"]);

export const createUserSessionSchema = z.object({
  userId: z.string().optional(),
  deviceId: z.string(),
  deviceName: z.string(),
  platform: platformSchema,
  tokenVersion: z.number().optional().default(1),
  refreshToken: z.string(),
});

export const lastActiveAtSessionUpdateSchema = z.object({
  lastActiveAt: z.date(),
});

export type Platform = z.infer<typeof platformSchema>;
export type CreateUserSession = z.infer<typeof createUserSessionSchema>;
export type LastActiveAtSessionUpdate = z.infer<
  typeof lastActiveAtSessionUpdateSchema
>;

export interface Session {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: Platform;
  tokenVersion: number;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
}
