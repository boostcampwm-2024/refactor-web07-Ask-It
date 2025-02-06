import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ShortenQuestionSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '질문 요약' }),
    ApiResponse({
      status: 201,
      description: '질문 요약 성공',
      schema: {
        example: {
          result: {
            question: '리마큐(Remacu)란 무엇인가요?',
          },
        },
      },
    }),
  );
