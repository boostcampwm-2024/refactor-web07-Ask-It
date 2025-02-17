import { Body, Controller, Post } from '@nestjs/common';
import { BroadcastEventDto } from '@socket/dto/broadcast-event.dto';
import { SocketGateway } from '@socket/socket.gateway';

import { AbuseChattingDto } from './dto/abuse-chatting-event.dto';

@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateway: SocketGateway) {}

  @Post('broadcast')
  async broadCast(@Body() { content, sessionId, token, event }: BroadcastEventDto) {
    const broadCastFunction = this.socketGateway.createEventBroadcaster(event);
    broadCastFunction(sessionId, token, content);
  }

  @Post('abuse-chattings')
  async updateChattings(@Body() { abuseChattings }: AbuseChattingDto) {
    const sessionToChattings = new Map<string, number[]>();
    abuseChattings.forEach(({ chattingId, sessionId }) => {
      const existingChatting = sessionToChattings.get(sessionId) ?? [];
      sessionToChattings.set(sessionId, [...existingChatting, chattingId]);
    });
    sessionToChattings.forEach((chattings, sessionId) => {
      this.socketGateway.broadcastAbuseChattings(sessionId, chattings);
    });
  }
}
