import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RetryQuestionSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '질문 개선작업 재요청' }),
    ApiResponse({
      status: 201,
      description: '질문 개선작업 재요청 성공',
      schema: {
        example: {
          result: {
            question: '## 책 질문 - 리마큐(Remacu)란 무엇인가요?',
          },
        },
      },
    }),
  );
