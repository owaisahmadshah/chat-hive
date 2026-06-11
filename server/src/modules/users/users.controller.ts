import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { CreateUser } from 'shared';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
export class UserController {
  @Post('register')
  registerUser(@Body() createUserDto: CreateUser) {
    console.log(createUserDto);
    return 'create user';
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile() {
    return 'user';
  }
}
