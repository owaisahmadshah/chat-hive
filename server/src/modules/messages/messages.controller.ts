import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type CreateMessage, createMessageSchema } from 'shared';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JWTPayload } from 'src/shared/types/jwt-payload.type';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(201)
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
}
