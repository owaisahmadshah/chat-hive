import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayload } from 'src/shared/types/jwt-payload.type';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  type ChatUser,
  chatUserSchema,
  type ImageURLUpdate,
  imageURLUpdateSchema,
  paginationSchema,
  type ReqPagination,
  type UserId,
  userIdSchema,
} from 'shared';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUser(@CurrentUser() reqUser: JWTPayload) {
    const user = await this.userService.getUser(reqUser.sub);
    return { data: user };
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  async getUserProfile(
    @Param(new ZodValidationPipe(userIdSchema)) params: UserId,
  ) {
    const user = await this.userService.getUser(params.id);
    return { data: user };
  }

  @UseGuards(AuthGuard)
  @Patch('image-url')
  async updateProfileImageURL(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(imageURLUpdateSchema)) imageDto: ImageURLUpdate,
  ) {
    const updatedUser = await this.userService.updateProfileImageURL(
      user.sub,
      imageDto.imageURL,
    );

    return { message: 'Updated profile image successfully', data: updatedUser };
  }

  @UseGuards(AuthGuard)
  @Get(':username')
  async getUsers(
    @Param(new ZodValidationPipe(chatUserSchema)) params: ChatUser,
    @Query(new ZodValidationPipe(paginationSchema)) pagination: ReqPagination,
  ) {
    const paginatedUsers = await this.userService.getUsers(
      params.username,
      pagination.limit,
      pagination.cursor,
    );
    return { data: paginatedUsers };
  }
}
