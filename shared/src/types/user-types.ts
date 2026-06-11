import { z } from "zod";

export const authProviderSchema = z.enum(["local", "google"]);

export const createUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  authProvider: authProviderSchema.default("local").optional(),
  password: z.string(),
});

export const usernameSchema = z.object({
  username: z.string(),
});

export type AuthProvider = z.infer<typeof authProviderSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UsernameSchema = z.infer<typeof usernameSchema>;

export interface UserSumnary {
  id: string;
  username: string;
  imageURL: string;
  lastSeen: Date;
  createdAt: Date;
}

export interface ReqUser {
  id: string;
  name: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  imageURL: string;
  email: string;
  lastSeen: string;
  authProvider: AuthProvider;
  authProviderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
