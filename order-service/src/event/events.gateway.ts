import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CacheService } from 'src/cache/cache.service';

export interface OnlineUser {
  user: any;
  socket_id: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  // private static onlineUser: OnlineUser[] = [];

  afterInit(server: Server) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (!client.handshake.auth.access_token) {
      client.disconnect();
      return;
    }

    try {
      const user = this.jwtService.verify(client.handshake.auth.access_token, {
        secret: 'abc',
      });
      // EventsGateway.onlineUser.push({
      //   user: user,
      //   socket_id: client.id,
      // });
      client.handshake.auth.user_id = user.id;
      console.log('Client connected ' + client.id);
      this.cacheService.set(user.id.toString(), client.id);
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ.');
    }
  }

  async emitOrderStatusUpdate(user_id: number) {
    // const userEmit = EventsGateway.onlineUser.find(
    //   (onlineUser) => onlineUser.user.id === user_id,
    // );
    const userEmit = await this.cacheService.get(user_id.toString());
    if (userEmit) {
      userEmit.forEach((value) =>
        this.server.to(value.client_id).emit('event', {}),
      );
      // this.server.to(userEmit).emit('event', {});
    }
  }

  async emitMessage(message: string, user_id: number) {
    const userEmit = await this.cacheService.get(user_id.toString());
    // const userEmit = EventsGateway.onlineUser.find(
    //   (onlineUser) => onlineUser.user.id === user_id,
    // );
    if (userEmit) {
      userEmit.forEach((value) =>
        this.server.to(value.client_id).emit('message', message),
      );
    }
  }

  async handleDisconnect(client: Socket) {
    this.cacheService.delete(
      client.handshake.auth.user_id.toString(),
      client.id,
    );
    console.log('Client disconnected ' + client.id);
    // EventsGateway.onlineUser = EventsGateway.onlineUser.filter(
    //   (onlineUser) => onlineUser.socket_id !== client.id,
    // );
  }
}
