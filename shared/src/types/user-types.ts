import { z } from "zod";
import { Pagination } from "./pagination-type";

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

export const loginUserSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const verifyOTPSchema = z.object({
  email: z.string().min(1, "Email is required"),
  otp: z.string().min(1, "OTP is required"),
});

export const resendOTP = z.object({
  email: z.string(),
});

export type AuthProvider = z.infer<typeof authProviderSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UsernameSchema = z.infer<typeof usernameSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type VerifyOTP = z.infer<typeof verifyOTPSchema>;
export type ResendOTP = z.infer<typeof resendOTP>;
export interface UserSummary {
  id: string;
  username: string;
  imageURL: string | null;
  lastSeen: Date | null;
  createdAt: Date;
}
export interface User {
  id: string;
  username: string;
  email: string;
  imageURL: string | null;
  lastSeen: Date | null;
  authProvider: AuthProvider;
  authProviderId: string | null;
  createdAt: Date;
}

export interface UserWithPassword {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  password: string | null;
  authProvider: AuthProvider;
  authProviderId: string | null;
}

export type PaginatedUsers = Pagination<UserSummary>;
