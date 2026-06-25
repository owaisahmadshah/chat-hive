import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './repositories/messages.repository';
import { MessageAttachmentRepository } from './repositories/message-attachment.repository';
import { MessageStatusRepository } from './repositories/message-status.repository';
import { DatabaseService } from 'src/core/database/database.service';
import { ChatMembersService } from '../chat-members/chat-members.service';
import { CreateMessage, Message, MessageStatusEnum } from 'shared';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessagesRepository,
    private readonly messageAttachmentRepository: MessageAttachmentRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
    private readonly databaseService: DatabaseService,
    private readonly chatMembersService: ChatMembersService,
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

        const members = await this.chatMembersService.getChatMembers(
          messageDto.chatId,
        );

        console.log(members);

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
      status: statuses,
      attachments,
    };
  }
}
