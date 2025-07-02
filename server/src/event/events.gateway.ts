import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
  constructor() {}

  afterInit(server: Socket) {
    console.log('Server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // setInterval(() => {
    //   // client.emit('event', 'hehe');
    // }, 10000);
  }

  emitOrderStatusUpdate() {
    this.server.emit('event', {});
  }

  emitMessage(message: string) {
    this.server.emit('message', message);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
  }
}
