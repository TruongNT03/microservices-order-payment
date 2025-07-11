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
import { Constant } from './event.constant';
import { ConfigService } from '@nestjs/config';

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
    private configSevice: ConfigService,
  ) {}

  afterInit(server: Server) {
    console.log('Server initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    if (!client.handshake.auth.access_token) {
      client.disconnect();
      return;
    }

    try {
      const user = this.jwtService.verify(client.handshake.auth.access_token, {
        secret: this.configSevice.get<string>('JWT_SECRET') || 'abc',
      });
      client.handshake.auth.user_id = user.id;
      console.log('Client connected ' + client.id);
      console.log(`user_id: ${user.id}`);

      this.cacheService.set(user.id.toString(), client.id);
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ.');
    }
  }

  async emitOrderStatusUpdate(user_id: number) {
    const userEmit = await this.cacheService.get(user_id.toString());
    console.log('User emit: ', userEmit);
    if (userEmit) {
      userEmit.forEach((value) => {
        (this.server.to(value.client_id).emit(Constant.OrderUpdateEvent, {}),
          console.log(`Đã emit tới client_id: ${value.client_id}
                       Với user_id: ${user_id}`));
      });
    }
  }

  async emitMessage(message: string, user_id: number) {
    const userEmit = await this.cacheService.get(user_id.toString());

    if (userEmit) {
      userEmit.forEach((value) => {
        (this.server
          .to(value.client_id)
          .emit(Constant.OrderMessageEvent, message),
          console.log(`Đã emit tới client_id: ${value.client_id}
                       Với user_id: ${user_id}`));
      });
    }
  }

  async handleDisconnect(client: Socket) {
    this.cacheService.delete(
      client.handshake.auth.user_id.toString(),
      client.id,
    );
    console.log('Client disconnected ' + client.id);
  }
}
