import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { UserRepository } from './users.repository';
import { CreateUser, UserWithPassword, User } from 'shared';
import { CryptoService } from 'src/shared/services/crypto.service';
import { userProjections } from './users.projections';
import { assertConflict, assertExists } from 'src/shared/assertions';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async createUser(data: CreateUser) {
    const emailExists = await this.userRepository.getUserByEmail(
      data.email,
      userProjections.summary,
    );

    assertConflict(!emailExists, 'Email already registered');

    const usernameExists = await this.userRepository.isUsernameExists(
      data.username,
    );

    assertConflict(!usernameExists, 'Username already taken');

    const hashedPassword = await this.cryptoService.hashPassword(data.password);

    const [savedUser] = await this.databaseService.transaction(async (tx) => {
      const createdUser = await this.userRepository.createUser(
        { ...data, password: hashedPassword },
        tx,
      );

      return [createdUser];
    });

    return savedUser;
  }

  async getUserWithPassword(identifier: string): Promise<UserWithPassword> {
    const user = await this.userRepository.getUserWithPassword(identifier);

    assertExists(user, 'User not found');
    return user;
  }

  async changePassword(userId: string, newPassword: string) {
    await this.databaseService.transaction(async (tx) => {
      await this.userRepository.updatePassword(userId, newPassword, tx);
    });
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(
      userId,
      userProjections.user,
    );

    assertExists(user, 'User not found');
    return user;
  }

  async updateVerification(userId: string, value: boolean = true) {
    return await this.userRepository.updateVerified(userId, value);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(
      email,
      userProjections.user,
    );

    assertExists(user, 'User not found');
    return user;
  }

  async updateProfileImageURL(userId: string, url: string) {
    return await this.userRepository.updateImageURL(userId, url);
  }

  async updateLastSeen(userId: string) {
    return await this.userRepository.updateLastSeen(userId);
  }
}
