import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  type ChatIdParam,
  chatIdParamSchema,
  type CreateChat,
  createChatSchema,
  paginationSchema,
  type ReqPagination,
  type UpdateChat,
  updateChatSchema,
} from 'shared';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JWTPayload } from 'src/shared/types/jwt-payload.type';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @HttpCode(201)
  @Post('new')
  @UseGuards(AuthGuard)
  async createChat(
    @Body(new ZodValidationPipe(createChatSchema)) chatDto: CreateChat,
    @CurrentUser() user: JWTPayload,
  ) {
    const createdChat = await this.chatsService.createChat(chatDto, user.sub);
    return { data: createdChat };
  }

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  async getMyChats(
    @CurrentUser() user: JWTPayload,
    @Query(new ZodValidationPipe(paginationSchema)) queries: ReqPagination,
  ) {
    const chats = await this.chatsService.getMyChats(
      user.sub,
      queries.limit,
      queries.cursor,
    );
    return { data: chats };
  }

  @HttpCode(200)
  @Get(':chatId')
  @UseGuards(AuthGuard)
  async getChatById(
    @CurrentUser() user: JWTPayload,
    @Param(new ZodValidationPipe(chatIdParamSchema)) params: ChatIdParam,
  ) {
    const chat = await this.chatsService.getChatById(user.sub, params.chatId);
    return { data: chat };
  }

  @HttpCode(200)
  @Patch(':chatId')
  @UseGuards(AuthGuard)
  async updateChat(
    @Param(new ZodValidationPipe(chatIdParamSchema)) params: ChatIdParam,
    @Body(new ZodValidationPipe(updateChatSchema)) updateDto: UpdateChat,
  ) {
    const updatedChat = await this.chatsService.updateChat(
      params.chatId,
      updateDto,
    );

    return { data: updatedChat };
  }
}
