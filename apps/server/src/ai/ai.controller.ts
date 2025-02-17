import { Readable } from 'stream';

import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

import { AiService } from './ai.service';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { AiRequestValidationGuard } from './guards/restrict-request.guard';

import { ImproveReplyDto } from '@ai/dto/improve-reply.dto';
import { RetryImproveQuestionDto } from '@ai/dto/retry-question.dto';
import { RetryImproveReplyDto } from '@ai/dto/retry-reply.dto';
import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';

@Controller('ai')
@UseGuards(AiRequestValidationGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  private handleStreamResponse(aiStream: Readable, res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let resultData = '';
    let chunkData = '';

    aiStream.on('data', (chunk) => {
      const rawData = chunk.toString();
      const lines = rawData.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(line.replace('data:', '').trim());
            if (jsonData.message && jsonData.message.content) {
              if (chunkData) {
                res.write(JSON.stringify({ type: 'stream', content: chunkData }) + '\n');
                resultData += chunkData;
              }
              chunkData = jsonData.message.content;
            }
          } catch (error) {}
        }
      }
    });

    aiStream.on('end', () => {
      if (chunkData) {
        res.write(JSON.stringify({ type: 'result', content: resultData + chunkData }) + '\n');
      }
      res.end();
    });

    aiStream.on('error', (err) => {
      res.status(500).json({ type: 'error', content: 'Error occurred while processing AI response' });
    });
  }

  @Post('question-improve')
  @ApiBody({ type: ImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveQuestion(@Body() improveQuestionDto: ImproveQuestionDto, @Res() res: Response) {
    const { body: userContent } = improveQuestionDto;
    const aiStream = await this.aiService.requestImproveQuestion(userContent);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('reply-improve')
  @ApiBody({ type: ImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveReply(@Body() improveReplyDto: ImproveReplyDto, @Res() res: Response) {
    const aiStream = await this.aiService.requestImproveReply(improveReplyDto);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('question-improve-retry')
  @ApiBody({ type: RetryImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveQuestion(@Body() retryImproveQuestionDto: RetryImproveQuestionDto, @Res() res: Response) {
    const aiStream = await this.aiService.retryImproveQuestion(retryImproveQuestionDto);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('reply-improve-retry')
  @ApiBody({ type: RetryImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveReply(@Body() retryImproveReplyDto: RetryImproveReplyDto, @Res() res: Response) {
    const aiStream = await this.aiService.retryImproveReply(retryImproveReplyDto);
    this.handleStreamResponse(aiStream, res);
  }
}
