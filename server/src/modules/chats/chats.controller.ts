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
import { ChatsService } from './chats.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  changeChatMemberRoleSchema,
  type ChangeMemberRole,
  type ChatIdParam,
  chatIdParamSchema,
  type CreateChat,
  type CreateChatMember,
  createChatMembersSchema,
  createChatSchema,
  type DeleteChatMember,
  deleteChatMemberSchema,
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

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  async createChat(
    @Body(new ZodValidationPipe(createChatSchema)) chatDto: CreateChat,
    @CurrentUser() user: JWTPayload,
  ) {
    const createdChat = await this.chatsService.createChat(chatDto, user.sub);
    return { data: createdChat };
  }

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
  @Get(':chatId')
  @UseGuards(AuthGuard)
  async getChatById(
    @CurrentUser() user: JWTPayload,
    @Param(new ZodValidationPipe(chatIdParamSchema)) params: ChatIdParam,
  ) {
    const chat = await this.chatsService.getChatById(user.sub, params.chatId);
    return { data: chat };
  }

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.CREATED)
  @Post('/member')
  @UseGuards(AuthGuard)
  async addMembers(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(createChatMembersSchema))
    dto: CreateChatMember[],
  ) {
    const member = await this.chatsService.addMembersWithAdmin(
      dto,
      user.sub,
      dto.at(0)!.chatId,
    );
    return { data: member };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/member/change-role')
  @UseGuards(AuthGuard)
  async updateRole(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(changeChatMemberRoleSchema))
    dto: ChangeMemberRole,
  ) {
    const member = await this.chatsService.changeRole(
      user.sub,
      dto.memberId,
      dto.chatId,
      dto.role,
    );

    return { data: member };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/member')
  @UseGuards(AuthGuard)
  async deleteMember(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(deleteChatMemberSchema)) dto: DeleteChatMember,
  ) {
    await this.chatsService.deleteMember(user.sub, dto.memberId, dto.chatId);

    return { data: {} };
  }

  // TODO: GET /sync refetch chats
}
