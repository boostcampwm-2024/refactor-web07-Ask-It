import { Body, Controller, Post } from '@nestjs/common';
import { BroadcastEventDto } from '@socket/dto/broadcast-event.dto';
import { SocketGateway } from '@socket/socket.gateway';

@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateway: SocketGateway) {}

  @Post('broadcast')
  async broadCast(@Body() { content, sessionId, token, event }: BroadcastEventDto) {
    const broadCastFunction = this.socketGateway.createEventBroadcaster(event);
    broadCastFunction(sessionId, token, content);
  }
}
