import { Readable } from 'stream';

import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

import { AiService } from './ai.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { AiRequestValidationGuard } from './guards/restrict-request.guard';
import { CreateHistorySwagger } from './swagger/create-history.swagger';
import { ImproveQuestionSwagger } from './swagger/improve-question.swagger';
import { ImproveReplySwagger } from './swagger/improve-reply.swagger';
import { RetryQuestionSwagger } from './swagger/retry-question.swagger';
import { RetryReplySwagger } from './swagger/retry-reply.swagger';

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

    let chunkData = '';
    let buffer = '';

    aiStream.on('data', (chunk) => {
      buffer += chunk.toString();
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        const lines = block.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data:')) {
            let dataStr = '';
            if (line === 'data:' && i + 1 < lines.length) {
              dataStr = lines[++i].trim();
            } else {
              dataStr = line.slice(5).trim();
            }
            try {
              const jsonData = JSON.parse(dataStr);
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
      }
    });

    aiStream.on('end', () => {
      if (chunkData) {
        res.write(JSON.stringify({ type: 'result', content: chunkData }) + '\n');
      }
      res.end();
    });

    aiStream.on('error', (err) => {
      res.status(500).json({ type: 'error', content: 'Error occurred while processing AI response' });
    });
  }

  @Post('question-improve')
  @ImproveQuestionSwagger()
  @ApiBody({ type: ImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveQuestion(@Body() improveQuestionDto: ImproveQuestionDto, @Res() res: Response) {
    const { body: userContent } = improveQuestionDto;
    const aiStream = await this.aiService.requestImproveQuestion(userContent);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('reply-improve')
  @ImproveReplySwagger()
  @ApiBody({ type: ImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveReply(@Body() improveReplyDto: ImproveReplyDto, @Res() res: Response) {
    const aiStream = await this.aiService.requestImproveReply(improveReplyDto);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('question-improve-retry')
  @RetryQuestionSwagger()
  @ApiBody({ type: RetryImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveQuestion(@Body() retryImproveQuestionDto: RetryImproveQuestionDto, @Res() res: Response) {
    const aiStream = await this.aiService.retryImproveQuestion(retryImproveQuestionDto);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('reply-improve-retry')
  @RetryReplySwagger()
  @ApiBody({ type: RetryImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveReply(@Body() retryImproveReplyDto: RetryImproveReplyDto, @Res() res: Response) {
    const aiStream = await this.aiService.retryImproveReply(retryImproveReplyDto);
    this.handleStreamResponse(aiStream, res);
  }

  @Post('history')
  @CreateHistorySwagger()
  @ApiBody({ type: CreateHistoryDto })
  public createHistory(@Body() createHistoryDto: CreateHistoryDto) {
    this.aiService.createHistory(createHistoryDto);
  }
}
