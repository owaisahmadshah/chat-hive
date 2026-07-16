import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  PresenceRepository,
  UserStatus,
} from 'src/core/redis/repositories/presence.repository';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly presenceRepository: PresenceRepository) {}

  async handleConnection(client: Socket) {
    const userIdHeader = client.handshake.headers['user-id'];
    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;

    if (!userId) {
      console.log(
        `[SECURITY] Connection rejected: Missing 'userid' header. Socket ID: ${client.id}`,
      );
      client.disconnect(true);
      return;
    }

    client.user = { sub: userId };

    await this.presenceRepository.setUserPresence(userId, {
      socketId: client.id,
      status: 'online',
    });

    console.log(`[GLOBAL ACTIVE] User ${userId} entered the application.`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.user?.sub;

    if (userId) {
      await this.presenceRepository.removeUserPresence(userId);
      console.log(`[GLOBAL INACTIVE] User ${userId} left the application.`);
    }
  }

  @SubscribeMessage('updateStatus')
  async handleUpdateStatus(
    @MessageBody() data: { status: UserStatus },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.user?.sub;
    if (!userId) return;

    if (data.status !== 'online' && data.status !== 'offline') {
      return { event: 'error', data: 'Invalid status type' };
    }

    await this.presenceRepository.updateUserStatus(userId, data.status);
    console.log(`[STATUS CHANGE] User ${userId} set status to: ${data.status}`);

    // Broadcast the update event to all other clients on the app
    this.server.emit('userPresenceChanged', { userId, status: data.status });

    return { status: 'success', updatedTo: data.status };
  }

  @SubscribeMessage('checkUserPresence')
  async handleCheckUserPresence(@MessageBody() data: { targetUserId: string }) {
    const presence = await this.presenceRepository.getUserPresence(
      data.targetUserId,
    );

    if (!presence) {
      // TODO: Fetch last seen from DB and respond
      return { userId: data.targetUserId, status: 'offline' };
    }

    return {
      userId: data.targetUserId,
      status: 'online',
    };
  }
}
