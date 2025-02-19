import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AbuseState, Chatting } from '@prisma/client';

import { ChatEvents } from './chat.event';
import { ChatsRepository } from './chats.repository';

import { LoggerService } from '@logger/logger.service';

export interface ChatSaveDto {
  sessionId: string;
  token: string;
  body: string;
}

interface SlangPredictResult {
  predicted: '욕설' | '일반어';
  probability: number;
}

type ChatWithClassification = Chatting & { classification: SlangPredictResult };

@Injectable()
export class ChatsService {
  private lastProcessedChattingId = 0;
  private readonly BATCH_SIZE = 50;
  private readonly SLANG_THRESHOLD = 0.95;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly logger: LoggerService,
    private readonly eventEmitter: ChatEvents,
  ) {}

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

  private logDetailedResults(results: ChatWithClassification[]) {
    results.map(({ chattingId, body, abuse, classification }) =>
      this.logger.log(`Abuse Detection Result - ${JSON.stringify({ chattingId, body, abuse, classification })}`),
    );
  }

  private async fetchNewChats() {
    const chats = await this.chatsRepository.getChatsForFilter(this.BATCH_SIZE, this.lastProcessedChattingId);
    this.lastProcessedChattingId = Math.max(...chats.map((chat) => chat.chattingId), this.lastProcessedChattingId);
    return chats;
  }

  private determineAbuseState(result: SlangPredictResult): AbuseState {
    if (!result) return AbuseState.SAFE;

    return result.predicted === '욕설' && result.probability > this.SLANG_THRESHOLD
      ? AbuseState.BLOCKED
      : AbuseState.SAFE;
  }

  private async processAbuseDetection(chats: Chatting[]) {
    const contents = chats.map((chat) => chat.body);
    const abuseCheckResults = await this.checkAbuse(contents);

    return chats.map((chat, index) => {
      const result = abuseCheckResults[index];
      const abuseState = this.determineAbuseState(result);

      return {
        ...chat,
        abuse: abuseState,
        classification: result,
      };
    });
  }

  private async updateAbuseStatus(chats: ChatWithClassification[]) {
    const updates = chats.map((chat) => this.chatsRepository.update(chat.chattingId, chat.abuse));
    await Promise.all(updates);
  }

  private notifyBlockedChats(results: ChatWithClassification[]) {
    const blockedChats = results
      .filter((result) => result.abuse === AbuseState.BLOCKED)
      .map(({ chattingId, sessionId }) => ({ chattingId, sessionId }));

    if (blockedChats.length > 0) {
      this.eventEmitter.emitAbuseDetected(blockedChats);
    }
  }

  private logBatchExecution(startTime: Date, processedCount: number) {
    const executionTime = new Date().getTime() - startTime.getTime();

    this.logger.log(
      `[BATCH] last chatting id: ${this.lastProcessedChattingId} ` +
        `chatting count: ${processedCount} ` +
        `execution time: ${executionTime}ms`,
    );
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'chatting-abuse-detection' })
  async detectAbuseBatch() {
    const startTime = new Date();

    try {
      const newChats = await this.fetchNewChats();
      if (!newChats.length) return;

      const abuseResults = await this.processAbuseDetection(newChats);
      await this.updateAbuseStatus(abuseResults);
      this.notifyBlockedChats(abuseResults);

      this.logDetailedResults(abuseResults);
      this.logBatchExecution(startTime, newChats.length);
    } catch (error) {
      this.logger.error('Error in abuse detection batch job', error.stack);
    }
  }

  async checkAbuse(content: string[]): Promise<SlangPredictResult[]> {
    const CLASSIFIER_SERVER_HOST = process.env.CLASSIFIER_SERVER_HOST;
    const CLASSIFIER_SERVER_PORT = process.env.CLASSIFIER_SERVER_PORT;
    const CHECK_FAILED: SlangPredictResult[] = content.map(() => ({ predicted: '일반어', probability: 0 }));

    try {
      const response = await fetch(`${CLASSIFIER_SERVER_HOST}:${CLASSIFIER_SERVER_PORT}/slang-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: content }),
      });

      if (!response.ok) {
        this.logger.error(`Classifier server response: ${response.status}`, response.statusText);
        return CHECK_FAILED;
      }

      const result = JSON.parse(await response.text());
      return result.predictions || CHECK_FAILED;
    } catch (error) {
      this.logger.error(`Unexpected error while requesting classifier server`, error.stack);
      return CHECK_FAILED;
    }
  }
}
