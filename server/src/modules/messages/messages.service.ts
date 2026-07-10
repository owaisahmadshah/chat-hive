import { Injectable, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './repositories/messages.repository';
import { MessageAttachmentRepository } from './repositories/message-attachment.repository';
import { MessageStatusRepository } from './repositories/message-status.repository';
import { DatabaseService } from 'src/core/database/database.service';
import {
  CreateMessage,
  CursorPayload,
  decodeCursor,
  encodeCursor,
  Message,
  MessageStatusEnum,
  Pagination,
} from 'shared';
import { MessageDeleteRepository } from './repositories/message-delete.repository';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessagesRepository,
    private readonly messageAttachmentRepository: MessageAttachmentRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
    private readonly messageDeleteRepository: MessageDeleteRepository,
    private readonly databaseService: DatabaseService,
    private readonly chatsService: ChatsService,
  ) {}

  async createMessage(dto: CreateMessage, userId: string): Promise<Message> {
    const [message, attachments, statuses] =
      await this.databaseService.transaction(async (tx) => {
        const { attachments: attachmentDto = [], ...messageDto } = dto;

        const message = await this.messageRepository.createMessages(
          {
            ...messageDto,
            senderId: userId,
          },
          tx,
        );

        const members = await this.chatsService.getChatMembers(
          messageDto.chatId,
        );

        const statusesDto = members.map((member) => ({
          userId: member.userId!,
          messageId: message.id,
          status: (member.userId === userId
            ? 'read'
            : 'sent') as MessageStatusEnum,
        }));

        console.log(statusesDto);

        const statuses = await this.messageStatusRepository.createManyStatus(
          statusesDto,
          tx,
        );

        const createdMessage = await this.messageRepository.getMessageById(
          message.id,
          tx,
        );

        if (attachmentDto.length) {
          const atmt: CreateMessage['attachments'] = attachmentDto.map(
            (atmtItem) => ({ ...atmtItem, messageId: message.id }),
          );

          const attachments =
            await this.messageAttachmentRepository.createAttachments(atmt, tx);

          return [createdMessage, attachments, statuses];
        }

        return [createdMessage, [], statuses];
      });

    return {
      ...message,
      statuses,
      attachments,
    };
  }

  async deleteMessage(messageId: string, userId: string) {
    const existingMessage =
      await this.messageRepository.getMessageIdById(messageId);

    if (!existingMessage) {
      throw new NotFoundException('Message not found');
    }

    const deletedMessage = await this.messageDeleteRepository.deleteMessage(
      messageId,
      userId,
    );

    return deletedMessage;
  }

  async getMessagesByChatId(
    chatId: string,
    userId: string,
    limit: number,
    cursor: string | null,
  ): Promise<Pagination<Message>> {
    const decodedCursor: CursorPayload | null = cursor
      ? decodeCursor(cursor)
      : null;

    const messages = await this.messageRepository.getMessagesByChatId(
      chatId,
      limit,
      userId,
      decodedCursor
        ? {
            id: decodedCursor.id,
            createdAt: new Date(decodedCursor.createdAt!),
          }
        : undefined,
    );

    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore
      ? encodeCursor({
          id: data.at(-1)!.id,
          createdAt: data.at(-1)!.createdAt?.toISOString(),
        })
      : null;

    return { data, nextCursor, hasMore };
  }

  async updateMessageStatus(
    userId: string,
    messageId: string,
    status: MessageStatusEnum,
  ) {
    const updatedMessageStatus =
      await this.messageStatusRepository.updateStatusByMessageId(
        messageId,
        userId,
        status,
      );

    if (!updatedMessageStatus) {
      throw new NotFoundException('Message status not found');
    }

    return updatedMessageStatus;
  }

  async updateMessagesStatusByChatId(
    userId: string,
    chatId: string,
    status: MessageStatusEnum,
  ) {
    const updatedRows =
      await this.messageStatusRepository.updateMessagesStatusByChatId(
        chatId,
        userId,
        status,
      );

    return { chatId, messageIds: updatedRows.map((row) => row.messageId) };
  }
}
