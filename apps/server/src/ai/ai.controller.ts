import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AiService } from './ai.service';
import { ImproveQuestionDto } from './dto/improve-question.dto';

import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('question-improve')
  @UseGuards(SessionTokenValidationGuard)
  public async improveQuestion(@Body() improveQuestionDto: ImproveQuestionDto) {
    const { body: userContent } = improveQuestionDto;
    const result = { question: await this.aiService.requestImproveQuestion(userContent) };
    return { result };
  }
}
