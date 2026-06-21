import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JWTPayload } from 'src/shared/types/jwt-payload.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUser(@CurrentUser() user: JWTPayload) {
    return await this.userService.getUser(user.sub);
  }
}
