import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import {
  createUserSchema,
  loginUserSchema,
  verifyOTPSchema,
  newPasswordSchema,
  type CreateUserSession,
  type CreateUser,
  type LoginUser,
  type VerifyOTP,
  resendOTPSchema,
  type ResendOTP,
  type NewPassword,
  type ResetPassword,
  resetPasswordSchema,
} from 'shared';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { Metadata } from 'src/common/decorators/metadata.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { type JWTPayload } from 'src/shared/types/jwt-payload.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ACCESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS } from './auth.constants';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/core/config/env';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(createUserSchema)) userDto: CreateUser,
  ) {
    return this.authService.register(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(
    @Metadata() metadata: CreateUserSession,
    @Body(new ZodValidationPipe(loginUserSchema)) userDto: LoginUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      userDto.identifier,
      userDto.password,
      {
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        platform: metadata.platform,
      },
    );

    response.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
    response.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS);

    return { message: 'Authentication successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('otp/verify')
  async verifyOTP(
    @Metadata() metadata: CreateUserSession,
    @Body(new ZodValidationPipe(verifyOTPSchema)) verifyDto: VerifyOTP,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.verifyOTP(
      verifyDto.email,
      verifyDto.otp,
      {
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        platform: metadata.platform,
      },
    );

    response.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
    response.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS);

    return { message: 'OTP verified successfully, your account is now active' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('otp/resend')
  async resendOTP(
    @Body(new ZodValidationPipe(resendOTPSchema)) verifyDto: ResendOTP,
  ) {
    await this.authService.resendOTP(verifyDto.email);

    return { message: 'A new OTP has been sent to your email' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @CurrentUser() user: JWTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.updateSession(user);

    response.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS);
    response.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);

    return { message: 'Session refreshed successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  @UseGuards(AuthGuard)
  async logout(
    @CurrentUser() user: JWTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.sub, user.sessionId);

    this.clearAuthCookies(response);

    return { message: 'Logged out successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('logout/all')
  @UseGuards(AuthGuard)
  async logoutAllDevices(
    @CurrentUser() user: JWTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logoutAllSessions(user.sub);

    this.clearAuthCookies(response);
    return { message: 'Logged out from all devices successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('logout/others')
  @UseGuards(AuthGuard)
  async logoutOtherDevices(
    @CurrentUser() user: JWTPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logoutAllSessionExcept(user.sub, user.sessionId);

    this.clearAuthCookies(response);
    return { message: 'Logged out from all other devices successfully' };
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('access_token', ACCESS_TOKEN_OPTIONS);
    response.clearCookie('refresh_token', REFRESH_TOKEN_OPTIONS);
  }

  @UseGuards(AuthGuard)
  @Patch('new-password')
  async setNewPassword(
    @CurrentUser() user: JWTPayload,
    @Body(new ZodValidationPipe(newPasswordSchema)) passwordDto: NewPassword,
  ) {
    const updatedUser = await this.authService.changePassword(
      user.sub,
      passwordDto.oldPassword,
      passwordDto.newPassword,
    );

    return { data: updatedUser };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new ZodValidationPipe(resendOTPSchema)) resendDto: ResendOTP,
  ) {
    await this.authService.resendOTP(resendDto.email);

    return { message: 'Send OTP successfully' };
  }

  @Post('reset-password')
  async resetPassword(
    @Metadata() metadata: CreateUserSession,
    @Body(new ZodValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPassword,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.password,
      {
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        platform: metadata.platform,
      },
    );

    response.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
    response.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS);

    return { message: 'Reset password successfully' };
  }

  @Get('google')
  googleSignIn(@Res() response: Response) {
    const state = randomBytes(16).toString('hex');

    response.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // callback is a top-level GET, lax is enough
      maxAge: 10 * 60 * 1000,
    });

    response.redirect(this.authService.getGoogleAuthUrl(state));
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const frontendUrl: string = this.configService.get('CLIENT_URL');

    try {
      if (!code || !state || state !== request.cookies?.oauth_state) {
        return response.redirect(`${frontendUrl}/sign-in?error=invalid_state`);
      }
      response.clearCookie('oauth_state');

      // Browser redirects can't carry your custom device headers,
      // so derive the session data here.
      const deviceId = (request.cookies?.device_id ?? randomUUID()) as string;
      response.cookie('device_id', deviceId, {
        httpOnly: true,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      const { accessToken, refreshToken } = await this.authService.googleSignIn(
        code,
        {
          deviceId,
          deviceName: request.headers['user-agent'] ?? 'Unknown',
          platform: 'web',
        },
      );

      response.cookie('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
      response.cookie('access_token', accessToken, ACCESS_TOKEN_OPTIONS);

      return response.redirect(`${frontendUrl}/`);
    } catch (error) {
      this.logger.error(
        'Google callback failed',
        error instanceof Error ? error.stack : String(error),
      );
      return response.redirect(
        `${frontendUrl}/sign-in?error=google_callback_failed`,
      );
    }
  }
}
