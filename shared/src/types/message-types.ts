import { z } from "zod";
import { MessageUser, User } from "./user-types";

export const messageStatusEnumSchema = z.enum(["sent", "delivered", "read"]);
export const attachmentTypeEnumSchema = z.enum([
  "image",
  "video",
  "file",
  "audio",
]);

export const messageAttachmentSchema = z.object({
  id: z.string().optional(),
  messageId: z.string().optional(),
  type: attachmentTypeEnumSchema,
  url: z.string().url(),
  publicId: z.string(),
  fileName: z.string().nullable(),
});

export const createMessageSchema = z
  .object({
    chatId: z.string(),
    senderId: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    replyTo: z.string().optional().nullable(),
    attachments: z.array(messageAttachmentSchema).optional().default([]),
  })
  .refine(
    (args) => args.text || (args.attachments && args.attachments.length > 0),
    {
      message: "Message must contain text or at least one attachment",
      path: ["text"],
    },
  );

export const messageStatusSchema = z.object({
  messageId: z.string(),
  userId: z.string().optional(),
  status: messageStatusEnumSchema,
  chatId: z.string().optional(),
});

export const updateMessageStatusSchema = z.object({
  chatId: z.string(),
  userId: z.string().optional(),
  status: messageStatusEnumSchema,
});

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  userId: z.string().optional(),
});

export type MessageStatusEnum = z.infer<typeof messageStatusEnumSchema>;
export type AttachmentTypeEnum = z.infer<typeof attachmentTypeEnumSchema>;
export type MessageAttachment = z.infer<typeof messageAttachmentSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type DeleteMessage = z.infer<typeof deleteMessageSchema>;
export type UpdateMessagesStatus = z.infer<typeof updateMessageStatusSchema>;

export interface MessageStatusRecord {
  id: string;
  messageId: string | null;
  userId: string | null;
  status: MessageStatusEnum;
  createdAt: Date;
}

export interface MessageAttachmentRecord {
  id: string;
  messageId: string | null;
  type: AttachmentTypeEnum;
  url: string;
  fileName: string | null;
  publicId: string;
  createdAt: Date | null;
}

export type ReplyToMessageRecord = null | {
  id: string;
  text: string | null;
  senderId: string;
};

export interface Message {
  id: string;
  chatId: string;
  sender: MessageUser;
  text: string | null;
  attachments: Omit<MessageAttachmentRecord, "messageId" | "publicId">[];
  replyTo: ReplyToMessageRecord;
  statuses: Omit<MessageStatusRecord, "messageId">[];
  createdAt: Date;
}
