import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { AiRequestValidationGuard } from './guards/restrict-request.guard';
import { CreateHistorySwagger } from './swagger/create-history.swagger';
import { ImproveQuestionSwagger } from './swagger/improve-question.swagger';

import { RetryImproveDto } from '@ai/dto/retry-question.dto';
import { RetryQuestionSwagger } from '@ai/swagger/retry-question.swagger';
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

  @Post('history')
  @CreateHistorySwagger()
  @ApiBody({ type: CreateHistoryDto })
  public createHistory(@Body() createHistoryDto: CreateHistoryDto) {
    this.aiService.createHistory(createHistoryDto);
  }

  @Post('question-improve-retry')
  @RetryQuestionSwagger()
  @UseGuards(SessionTokenValidationGuard)
  public async retryImproveQuestion(@Body() retryImproveDto: RetryImproveDto) {
    const result = { question: await this.aiService.retryImproveQuestion(retryImproveDto) };
    return { result };
  }
}
