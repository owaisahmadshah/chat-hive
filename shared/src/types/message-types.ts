import { z } from "zod";
import { User } from "./user-types";

export const messageStatusEnumSchema = z.enum(["sent", "delivered", "read"]);

export const mediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "audio"]),
  src: z.string().url(),
});

export const mediaSchema = z.array(mediaItemSchema).nullable();

export const createMessageSchema = z
  .object({
    chatId: z.string(),
    senderId: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    media: mediaItemSchema.optional().nullable(),
    replyTo: z.string().optional().nullable(),
  })
  .refine((args) => args.text || args.media, {
    message: "Message must contain text or media",
    path: ["text", "media"],
  });

export const messageStatusSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
  status: messageStatusEnumSchema,
});

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
});

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type MessageStatusEnum = z.infer<typeof messageStatusEnumSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type DeleteMessage = z.infer<typeof deleteMessageSchema>;

export interface Message {
  id: string;
  chatId: string;
  sender: User;
  text: string | null;
  media: MediaItem[] | null;
  replyTo: Message | null;
  status: MessageStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
