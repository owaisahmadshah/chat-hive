import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { RedisService } from 'src/core/redis/redis.service';
import { UsersService } from '../users/users.service';
import { CryptoService } from 'src/shared/services/crypto.service';
import { CreateUser, CreateUserSession } from 'shared';
import { UserSessionService } from '../user-session/user-session.service';
import { JWTPayload } from 'src/shared/types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/core/config/env';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly userSessionService: UserSessionService,
    private readonly ConfigService: ConfigService<EnvConfig, true>,
  ) {}

  async register(data: CreateUser) {
    await this.usersService.createUser(data);

    const otp = this.cryptoService.genNumericOTP();
    await this.sendOTP(data.email, data.username, otp);
  }

  async signIn(
    identifier: string,
    password: string,
    sessionData: CreateUserSession,
  ) {
    const user = await this.usersService.getUserWithPassword(identifier);

    if (!user.verified) {
      await this.sendOTP(
        user.email,
        user.username,
        this.cryptoService.genNumericOTP(),
      );

      throw new ForbiddenException('User is not verified');
    }

    if (user.authProvider === 'google' || !user.password) {
      throw new ForbiddenException('Please sign in with Google');
    }

    const isPasswordCorrect = await this.cryptoService.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.createSessionWithTokens(
      { id: user.id, username: user.username, email: user.email },
      sessionData,
    );

    return tokens;
  }

  private async createSessionWithTokens(
    user: { id: string; email: string; username: string },
    sessionData: CreateUserSession,
  ) {
    const session = await this.userSessionService.createSession({
      ...sessionData,
      userId: user.id,
      refreshToken: 'temp',
    });

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      username: user.email,
      sessionId: session.id,
    };

    const { accessToken, refreshToken } = await this.genTokens(payload);

    await this.userSessionService.updateRefreshToken(session.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string, sessionId: string) {
    await this.userSessionService.getSessionByIdAndUserId(sessionId, userId);

    const deletedSession =
      await this.userSessionService.deleteSession(sessionId);

    return deletedSession;
  }

  async logoutAllSessionExcept(userId: string, sessionId: string) {
    return await this.userSessionService.deleteAllSessionsExcept(
      userId,
      sessionId,
    );
  }

  async logoutAllSessions(userId: string) {
    return await this.userSessionService.deleteAllSessions(userId);
  }

  async updateSession(payload: JWTPayload) {
    const { accessToken, refreshToken } = await this.genTokens(payload);

    await this.userSessionService.updateRefreshToken(
      payload.sessionId,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  async verifyOTP(email: string, otp: string, sessionData: CreateUserSession) {
    const isValidOTP = await this.redisService.verifyOTP(email, otp);

    if (!isValidOTP) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    const user = await this.usersService.getUserByEmail(email);

    await this.usersService.updateVerification(user.id);

    const tokens = await this.createSessionWithTokens(
      { id: user.id, email: user.email, username: user.username },
      { ...sessionData, userId: user.id },
    );

    return tokens;
  }

  async resendOTP(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    const otp = this.cryptoService.genNumericOTP();
    await this.sendOTP(user.email, user.username, otp);
  }

  // Sends OTP and stores it in databse
  private async sendOTP(email: string, username: string, otp: string) {
    try {
      await this.redisService.setOTP(email, otp);
    } catch (redisError) {
      this.logger.error(
        `Failed to set OTP for ${email}:`,
        redisError instanceof Error ? redisError.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Failed to initialize security verification. Please try again.',
      );
    }

    try {
      await this.emailService.sendOTPEmail(email, username, otp);
    } catch (emailError) {
      this.logger.error(
        `Failed to sent OTP to ${email}:`,
        emailError instanceof Error ? emailError.stack : undefined,
      );
    }
  }

  private async genTokens(payload: JWTPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.ConfigService.get('REFRESH_TOKEN_EXPIRY'),
    });

    return { accessToken, refreshToken };
  }
}
