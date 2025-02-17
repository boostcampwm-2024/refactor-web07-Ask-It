import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AbuseState } from '@prisma/client';

import { ChatsRepository } from './chats.repository';

export interface ChatSaveDto {
  sessionId: string;
  token: string;
  body: string;
}

interface SlangPredictResult {
  predicted: '욕설' | '일반어';
  probability: number;
}

@Injectable()
export class ChatsService {
  private lastProcessedChattingId = 0;
  private readonly BATCH_SIZE = 10; //TODO: 적합한 수치 확인 필요

  constructor(private readonly chatsRepository: ChatsRepository) {}

  async saveChat(data: ChatSaveDto) {
    const chat = await this.chatsRepository.save(data);
    const { chattingId, createUserTokenEntity, body: content } = chat;
    return {
      chattingId,
      nickname: createUserTokenEntity?.user?.nickname || '익명',
      content,
      abuse: chat.abuse === 'BLOCKED' ? true : false,
    };
  }

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

  @Cron(CronExpression.EVERY_MINUTE, { name: 'chatting-abuse-detection' }) //TODO: 적합한 수치 필요
  async detectAbuseBatch() {
    const startTime = new Date();
    console.log(`1. start batch ${this.lastProcessedChattingId}`);

    const newChats = await this.chatsRepository.getChatsForFilter(this.BATCH_SIZE, this.lastProcessedChattingId);
    this.lastProcessedChattingId = newChats.reduce(
      (max, { chattingId }) => Math.max(max, chattingId),
      this.lastProcessedChattingId,
    );
    const abuseResult = await Promise.all(
      newChats.map(async ({ chattingId, body, sessionId }) => {
        const abuse = (await this.checkAbuse(body)) ? AbuseState.BLOCKED : AbuseState.SAFE;
        this.chatsRepository.update(chattingId, abuse);
        return { chattingId, sessionId, abuse };
      }),
    );

    this.broadcast(abuseResult.filter(({ abuse }) => abuse === AbuseState.BLOCKED));

    const endTime = new Date();
    const executionTime = endTime.getTime() - startTime.getTime();
    console.log(`2. end batch - Execution time: ${executionTime}ms`);
  }

  async broadcast(abuseChattings: { chattingId: number; sessionId: string }[]) {
    const SOCKET_SERVER_HOST = process.env.SOCKET_SERVER_HOST;
    const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT;

    try {
      fetch(`${SOCKET_SERVER_HOST}:${SOCKET_SERVER_PORT}/api/socket/abuse-chattings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abuseChattings }),
      });
    } catch (error) {
      console.error('/api/socket/abuse-chattings fetch 요청 실패', error);
    }
  }

  async checkAbuse(content: string) {
    const CLASSIFIER_SERVER_HOST = process.env.CLASSIFIER_SERVER_HOST;
    const CLASSIFIER_SERVER_PORT = process.env.CLASSIFIER_SERVER_PORT;

    try {
      const response = await fetch(`${CLASSIFIER_SERVER_HOST}:${CLASSIFIER_SERVER_PORT}/slang-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: content }),
      });

      if (!response.ok) {
        //TODO: 로깅 (Classifier server error: ${response.status} ${response.statusText})
        return false;
      }

      const data: SlangPredictResult = JSON.parse(await response.text());
      console.log(`[${data.predicted} ${data.probability}] ${content}`);
      return data.predicted === '욕설';
    } catch (error) {
      //TODO: 로깅 필요
      return false;
    }
  }
}
