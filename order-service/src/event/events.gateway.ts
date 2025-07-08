import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  constructor(private jwtService: JwtService) {}

  private static onlineUser: OnlineUser[] = [];

  afterInit(server: Server) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (!client.handshake.auth.access_token) {
      client.disconnect();
      return;
    }
    const user = this.jwtService.verify(client.handshake.auth.access_token, {
      secret: 'abc',
    });
    console.log('Client connected ' + client.id);
    EventsGateway.onlineUser.push({
      user: user,
      socket_id: client.id,
    });
  }

  emitOrderStatusUpdate(user_id: number) {
    const userEmit = EventsGateway.onlineUser.find(
      (onlineUser) => onlineUser.user.id === user_id,
    );
    if (userEmit) {
      this.server.to(userEmit.socket_id).emit('event', {});
    }
  }

  emitMessage(message: string, user_id: number) {
    const userEmit = EventsGateway.onlineUser.find(
      (onlineUser) => onlineUser.user.id === user_id,
    );
    if (userEmit) {
      this.server.to(userEmit.socket_id).emit('message', message);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    EventsGateway.onlineUser = EventsGateway.onlineUser.filter(
      (onlineUser) => onlineUser.socket_id !== client.id,
    );
  }
}
