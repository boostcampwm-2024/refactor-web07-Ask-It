import { Injectable } from '@nestjs/common';

import { CreateHistoryDto } from './dto/create-history.dto';

import { PrismaService } from '@prisma-alias/prisma.service';

interface ClovaApiResponse {
  status: {
    code: string;
    message: string;
  };
  result?: {
    message: {
      role: string;
      content: string;
    };
    stopReason: string;
    inputLength: number;
    outputLength: number;
    aiFilter?: Array<{
      groupName: string;
      name: string;
      score: string;
    }>;
  };
}

@Injectable()
export class AiService {
  private readonly CLOVA_API_URL: string;
  private readonly API_KEY: string;

  constructor(private readonly prisma: PrismaService) {
    this.CLOVA_API_URL = process.env.CLOVA_API_URL;
    this.API_KEY = 'Bearer ' + process.env.CLOVA_API_KEY;
  }

  public async requestImproveQuestion(userContent: string) {
    const prompt = await this.prisma.prompt.findUnique({ where: { name: 'IMPROVE_QUESTION' } });
    return await this.requestAIResponse(userContent, prompt.content);
  }

  public async requestShortenQuestion(userContent: string) {
    const prompt = await this.prisma.prompt.findUnique({ where: { name: 'SHORTEN_QUESTION' } });
    return await this.requestAIResponse(userContent, prompt.content);
  }

  public async createHistory({ request, response, promptName, result }: CreateHistoryDto) {
    await this.prisma.promptHistory.create({
      data: { request, response, promptName, result },
    });
  }

  private async requestAIResponse(userContent: string, prompt: string) {
    const headers = {
      Authorization: this.API_KEY,
      'Content-Type': 'application/json',
    };

    const requestData = {
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      topP: 0.8,
      topK: 0,
      maxTokens: 1024,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };

    const response = await fetch(this.CLOVA_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    });

    const data: ClovaApiResponse = JSON.parse(await response.text());

    return data.result.message.content;
  }
}
