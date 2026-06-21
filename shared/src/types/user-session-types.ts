import { z } from "zod";

export const platformSchema = z.enum(["web", "android", "ios", "desktop"]);

export const createUserSessionSchema = z.object({
  userId: z.string().optional(),
  deviceId: z.string(),
  deviceName: z.string(),
  platform: platformSchema,
  refreshToken: z.string().optional(),
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
  userId: string | null;
  deviceId: string;
  deviceName: string;
  platform: Platform;
  refreshToken: string | null;
  createdAt: Date | null;
}

export type SessionSummary = Omit<Session, "deviceName" | "platform">;
