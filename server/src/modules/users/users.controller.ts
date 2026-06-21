import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayload } from 'src/shared/types/jwt-payload.type';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type ImageURLUpdate, imageURLUpdateSchema } from 'shared';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUser(@CurrentUser() user: JWTPayload) {
    return await this.userService.getUser(user.sub);
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
}
