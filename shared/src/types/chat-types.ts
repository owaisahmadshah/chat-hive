import { z } from "zod";
import { User } from "./user-types";

export const chatRoleSchema = z.enum(["admin", "member"]);

const baseCreateChatSchema = z.object({
  createdBy: z.string(),
  name: z.string().optional().nullable(),
  logoURL: z.string().optional().nullable(),
  isGroup: z.boolean(),
  members: z
    .array(z.string().uuid())
    .max(5, "You can add up to 5 users at once")
    .optional()
    .nullable(),
});

export const createChatSchema = baseCreateChatSchema.refine(
  (args) => {
    if (args.isGroup) return true;
    return Array.isArray(args.members) && args.members.length > 0;
  },
  {
    message: "Direct messages must include at least one member",
    path: ["members"],
  },
);

export const createChatMemberSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
  role: chatRoleSchema,
});

export const deleteChatSchema = z.object({
  chatId: z.string(),
});

export const chatIdParamSchema = z.object({
  chatId: z.string().uuid(),
});

export const deleteChatMemberSchema = z.object({
  chatMemberId: z.string(),
});

export const updateChatSchema = z
  .object({
    name: z.string().min(1).optional(),
    logoURL: z.string().url().optional().nullable(),
  })
  .refine((args) => args.name || args.logoURL);

export const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "member"]).optional(),
});

export type ChatRole = z.infer<typeof chatRoleSchema>;
export type CreateChat = z.infer<typeof baseCreateChatSchema>;
export type CreateChatMember = z.infer<typeof createChatMemberSchema>;
export type DeleteChat = z.infer<typeof deleteChatSchema>;
export type ChatIdParam = z.infer<typeof chatIdParamSchema>;
export type UpdateChat = z.infer<typeof updateChatSchema>;
export type AddMember = z.infer<typeof addMemberSchema>;

export interface ChatMember {
  id: string;
  role: ChatRole;
  joinedAt: Date;
  deletedAt?: Date | null;
  // ------------
  userId: string;
  imageURL: string;
  username: string;
  lastSeen: Date;
}

export interface Chat {
  id: string;
  name: string | null;
  isGroup: boolean;
  members: ChatMember[];
  updatedAt: Date | null;
  unreadCount?: number;
}
