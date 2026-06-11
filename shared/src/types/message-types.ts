import { z } from "zod";
import { User } from "./user-types";

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
  fileName: z.string(),
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
  userId: z.string(),
  status: messageStatusEnumSchema,
});

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
});

export type MessageStatusEnum = z.infer<typeof messageStatusEnumSchema>;
export type AttachmentTypeEnum = z.infer<typeof attachmentTypeEnumSchema>;
export type MessageAttachment = z.infer<typeof messageAttachmentSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type DeleteMessage = z.infer<typeof deleteMessageSchema>;

export interface Message {
  id: string;
  chatId: string;
  sender: User;
  text: string | null;
  attachments: MessageAttachment[];
  replyTo: Message | null;
  status: MessageStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
