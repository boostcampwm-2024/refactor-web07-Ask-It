import { Injectable } from '@nestjs/common';

import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async getChatsForInfiniteScroll(sessionId: string, count: number, chatId?: number) {
    const chats = await this.chatsRepository.getChatsForInfiniteScroll(sessionId, count, chatId);

    return chats.map((x) => {
      const { createUserTokenEntity, chattingId, body: content, abuse } = x;
      const { user } = createUserTokenEntity;
      const nickname = user?.nickname || '익명';
      return {
        chattingId,
        nickname,
        content,
        abuse: abuse === 'BLOCKED' ? true : false,
      };
    });
  }
}
