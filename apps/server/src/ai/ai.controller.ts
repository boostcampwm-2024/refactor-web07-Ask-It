import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { ShortenQuestionDto } from './dto/shorten-question.dto';
import { AiRequestValidationGuard } from './guards/restrict-request.guard';
import { CreateHistorySwagger } from './swagger/create-history.swagger';
import { ImproveQuestionSwagger } from './swagger/improve-question.swagger';
import { ShortenQuestionSwagger } from './swagger/shorten-question.swagger';

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

  @Post('question-shorten')
  @ShortenQuestionSwagger()
  @ApiBody({ type: ShortenQuestionDto })
  @UseGuards(SessionTokenValidationGuard)
  public async shortenQuestion(@Body() shortenQuestionDto: ShortenQuestionDto) {
    const { body: userContent } = shortenQuestionDto;
    const result = { question: await this.aiService.requestShortenQuestion(userContent) };
    return { result };
  }

  @Post('history')
  @CreateHistorySwagger()
  @ApiBody({ type: CreateHistoryDto })
  public createHistory(@Body() createHistoryDto: CreateHistoryDto) {
    this.aiService.createHistory(createHistoryDto);
  }
}
