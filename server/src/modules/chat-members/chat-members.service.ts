import { Injectable } from '@nestjs/common';
import { ChatMembersRepository } from './chat-members.repository';
import { CreateChatMember } from 'shared';
import { DBClient } from 'src/core/database/database.service';

@Injectable()
export class ChatMembersService {
  constructor(private readonly chatMembersRepository: ChatMembersRepository) {}

  async addMember(data: CreateChatMember, tx?: DBClient) {}

  async addMembers(data: CreateChatMember[], tx?: DBClient) {}

  async changeRole() {}

  async removeMember() {}
}
