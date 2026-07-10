import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  type ChatIdParam,
  chatIdParamSchema,
  type CreateMessage,
  createMessageSchema,
  type DeleteMessage,
  deleteMessageSchema,
  type MessageStatus,
  messageStatusSchema,
  paginationSchema,
  type ReqPagination,
  type UpdateMessagesStatus,
  updateMessageStatusSchema,
} from 'shared';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JWTPayload } from 'src/shared/types/jwt-payload.type';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  async createMessage(
    @Body(new ZodValidationPipe(createMessageSchema)) messageDto: CreateMessage,
    @CurrentUser() user: JWTPayload,
  ) {
    const createdMessage = await this.messagesService.createMessage(
      messageDto,
      user.sub,
    );

    return { data: createdMessage };
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':messageId')
  @UseGuards(AuthGuard)
  async deleteMessage(
    @CurrentUser() user: JWTPayload,
    @Param(new ZodValidationPipe(deleteMessageSchema)) params: DeleteMessage,
  ) {
    const deletedMessage = await this.messagesService.deleteMessage(
      params.messageId,
      user.sub,
    );

    return { data: deletedMessage };
  }

  @HttpCode(HttpStatus.OK)
  @Get('all/:chatId')
  @UseGuards(AuthGuard)
  async getChatMessages(
    @Param(new ZodValidationPipe(chatIdParamSchema)) params: ChatIdParam,
    @CurrentUser() user: JWTPayload,
    @Query(new ZodValidationPipe(paginationSchema)) queries: ReqPagination,
  ) {
    const messages = await this.messagesService.getMessagesByChatId(
      params.chatId,
      user.sub,
      Number(queries.limit),
      queries.cursor,
    );

    return { data: messages };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('status/update-one')
  @UseGuards(AuthGuard)
  async updateMessageStatus(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(messageStatusSchema)) body: MessageStatus,
  ) {
    const updatedStatus = await this.messagesService.updateMessageStatus(
      user.sub,
      body.messageId,
      body.status,
    );

    return { data: updatedStatus };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('status/update-many')
  @UseGuards(AuthGuard)
  async updateMessagesStatusByChatId(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(updateMessageStatusSchema))
    body: UpdateMessagesStatus,
  ) {
    const updatedStatus =
      await this.messagesService.updateMessagesStatusByChatId(
        user.sub,
        body.chatId,
        body.status,
      );

    return { data: updatedStatus };
  }

  // TODO: DELETE message for all users
}
