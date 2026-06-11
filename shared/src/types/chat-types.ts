import { z } from "zod";
import { User } from "./user-types";

export const chatRoleSchema = z.enum(["admin", "member"]);

export const createChatSchema = z.object({
  createdBy: z.string(),
  name: z.string().optional().nullable(),
  logoURL: z.string().optional().nullable(),
  isGroup: z.boolean(),
});

export const createChatMemberSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  role: chatRoleSchema,
});

export const deleteChatMemberSchema = z.object({
  chatMemberId: z.string(),
});

export type ChatRole = z.infer<typeof chatRoleSchema>;
export type CreateChat = z.infer<typeof createChatSchema>;
export type CreateChatMember = z.infer<typeof createChatMemberSchema>;

export interface ChatMember {
  id: string;
  role: ChatRole;
  joinedAt: Date;
  deletedAt: Date | null;
  // ------------
  userId: string;
  imageURL: string;
  username: string;
  lastSeen: Date;
}

export interface Chat {
  id: string;
  createdBy: User;
  name: string | null;
  isGroup: boolean;
  members: ChatMember[];
  createdAt: Date;
  updatedAt: Date;
}
