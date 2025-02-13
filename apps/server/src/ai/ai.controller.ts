import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { AiRequestValidationGuard } from './guards/restrict-request.guard';
import { CreateHistorySwagger } from './swagger/create-history.swagger';
import { ImproveQuestionSwagger } from './swagger/improve-question.swagger';

import { ImproveReplyDto } from '@ai/dto/improve-reply.dto';
import { RetryImproveQuestionDto } from '@ai/dto/retry-question.dto';
import { RetryImproveReplyDto } from '@ai/dto/retry-reply.dto';
import { ImproveReplySwagger } from '@ai/swagger/improve-reply.swagger';
import { RetryQuestionSwagger } from '@ai/swagger/retry-question.swagger';
import { RetryReplySwagger } from '@ai/swagger/retry-reply.swagger';
import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';

@Controller('ai')
@UseGuards(AiRequestValidationGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('question-improve')
  @ImproveQuestionSwagger()
  @ApiBody({ type: ImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveQuestion(@Body() improveQuestionDto: ImproveQuestionDto) {
    const { body: userContent } = improveQuestionDto;
    const result = { question: await this.aiService.requestImproveQuestion(userContent) };
    return { result };
  }

  @Post('reply-improve')
  @ImproveReplySwagger()
  @ApiBody({ type: ImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async improveReply(@Body() improveReplyDto: ImproveReplyDto) {
    const result = { reply: await this.aiService.requestImproveReply(improveReplyDto) };
    return { result };
  }

  @Post('question-improve-retry')
  @RetryQuestionSwagger()
  @ApiBody({ type: RetryImproveQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveQuestion(@Body() retryImproveQuestionDto: RetryImproveQuestionDto) {
    const result = { question: await this.aiService.retryImproveQuestion(retryImproveQuestionDto) };
    return { result };
  }

  @Post('reply-improve-retry')
  @RetryReplySwagger()
  @ApiBody({ type: RetryImproveReplyDto })
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveReply(@Body() retryImproveReplyDto: RetryImproveReplyDto) {
    const result = { reply: await this.aiService.retryImproveReply(retryImproveReplyDto) };
    return { result };
  }

  @Post('history')
  @CreateHistorySwagger()
  @ApiBody({ type: CreateHistoryDto })
  public createHistory(@Body() createHistoryDto: CreateHistoryDto) {
    this.aiService.createHistory(createHistoryDto);
  }
}
