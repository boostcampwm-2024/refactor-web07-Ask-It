import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ImproveQuestionDto } from './dto/improve-question.dto';
import { ImproveQuestionSwagger } from './swagger/improve-question.swagger';

import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';
@Controller('ai')
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
}
