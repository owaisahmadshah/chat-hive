import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { UserRepository } from './users.repository';
import { CreateUser, UserWithPassword, User } from 'shared';
import { CryptoService } from 'src/shared/services/crypto.service';
import { userProjections } from './users.projections';

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

    if (emailExists) {
      throw new ConflictException('Email address is already registered');
    }

    const usernameExists = await this.userRepository.isUsernameExists(
      data.username,
    );

    if (usernameExists) {
      throw new ConflictException('Username is already taken');
    }

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

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
