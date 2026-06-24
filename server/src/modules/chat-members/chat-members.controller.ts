import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  changeChatMemberRoleSchema,
  type ChangeMemberRole,
  type CreateChatMember,
  createChatMembersSchema,
  type DeleteChatMember,
  deleteChatMemberSchema,
} from 'shared';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JWTPayload } from 'src/shared/types/jwt-payload.type';

@Controller('chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  async addMembers(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(createChatMembersSchema))
    dto: CreateChatMember[],
  ) {
    const member = await this.chatMembersService.addMembersWithAdmin(
      dto,
      user.sub,
      dto.at(0)!.chatId,
    );
    return { data: member };
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/change-role')
  @UseGuards(AuthGuard)
  async updateRole(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(changeChatMemberRoleSchema))
    dto: ChangeMemberRole,
  ) {
    const member = await this.chatMembersService.changeRole(
      user.sub,
      dto.memberId,
      dto.chatId,
      dto.role,
    );

    return { data: member };
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  @UseGuards(AuthGuard)
  async deleteMember(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(deleteChatMemberSchema)) dto: DeleteChatMember,
  ) {
    await this.chatMembersService.deleteMember(
      user.sub,
      dto.memberId,
      dto.chatId,
    );

    return { data: {} };
  }
}
