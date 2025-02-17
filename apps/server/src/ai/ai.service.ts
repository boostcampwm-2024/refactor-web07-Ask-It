import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CreateHistoryDto } from './dto/create-history.dto';

import { ImproveReplyDto } from '@ai/dto/improve-reply.dto';
import { RetryImproveQuestionDto } from '@ai/dto/retry-question.dto';
import { RetryImproveReplyDto } from '@ai/dto/retry-reply.dto';
import { PrismaService } from '@prisma-alias/prisma.service';

type Role = 'system' | 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

@Injectable()
export class AiService {
  private readonly CLOVA_API_QUESTION_URL: string;
  private readonly CLOVA_API_REPLY_URL: string;
  private readonly API_KEY: string;

  constructor(private readonly prisma: PrismaService) {
    this.CLOVA_API_QUESTION_URL = process.env.CLOVA_API_QUESTION_URL;
    this.CLOVA_API_REPLY_URL = process.env.CLOVA_API_REPLY_URL;
    this.API_KEY = 'Bearer ' + process.env.CLOVA_API_KEY;
  }

  public async requestImproveQuestion(userContent: string) {
    const { content: prompt } = await this.prisma.prompt.findUnique({ where: { name: 'IMPROVE_QUESTION' } });
    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: userContent },
    ];
    return await this.requestAIResponse(messages, this.CLOVA_API_QUESTION_URL);
  }

  public async requestImproveReply({ body: userContent, originalQuestion }: ImproveReplyDto) {
    const { content: prompt } = await this.prisma.prompt.findUnique({ where: { name: 'IMPROVE_REPLY' } });
    const content = `# Q) ${originalQuestion} # A) ${userContent}`;
    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: content },
    ];
    return await this.requestAIResponse(messages, this.CLOVA_API_REPLY_URL);
  }

  public async retryImproveQuestion({ original, received, retryMessage }: RetryImproveQuestionDto) {
    if (retryMessage.length === 0) {
      retryMessage = '질문을 더 개선해주세요.';
    }
    const { content: prompt } = await this.prisma.prompt.findUnique({ where: { name: 'IMPROVE_QUESTION' } });
    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: original },
      { role: 'assistant', content: received },
      { role: 'user', content: retryMessage },
    ];
    return await this.requestAIResponse(messages, this.CLOVA_API_QUESTION_URL);
  }

  public async retryImproveReply({ originalQuestion, original, received, retryMessage }: RetryImproveReplyDto) {
    if (retryMessage.length === 0) {
      retryMessage = '답변을 더 개선해주세요.';
    }
    const content = `# Q) ${originalQuestion} # A) ${original}`;
    const { content: prompt } = await this.prisma.prompt.findUnique({ where: { name: 'IMPROVE_REPLY' } });
    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: content },
      { role: 'assistant', content: received },
      { role: 'user', content: retryMessage },
    ];
    return await this.requestAIResponse(messages, this.CLOVA_API_REPLY_URL);
  }

  public async createHistory({ request, response, promptName, result }: CreateHistoryDto) {
    await this.prisma.promptHistory.create({
      data: { request, response, promptName, result },
    });
  }

  private async requestAIResponse(messages: Message[], url: string) {
    const headers = {
      Authorization: this.API_KEY,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    };

    const requestData = {
      messages,
      topP: 0.8,
      topK: 0,
      maxTokens: 1024,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };

    const response = await axios.post(url, requestData, {
      headers,
      responseType: 'stream',
    });

    return response.data;
  }
}
