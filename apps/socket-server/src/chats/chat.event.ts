import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const CHAT_EVENTS = {
  ABUSE_DETECTED: 'chat.abuse.detected',
};

@Injectable()
export class ChatEvents {
  constructor(private eventEmitter: EventEmitter2) {}

  emitAbuseDetected(
    payload: {
      chattingId: number;
      sessionId: string;
    }[],
  ) {
    this.eventEmitter.emit(CHAT_EVENTS.ABUSE_DETECTED, payload);
  }
}
