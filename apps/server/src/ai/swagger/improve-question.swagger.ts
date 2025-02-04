import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ImproveQuestionSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '질문 개선' }),
    ApiResponse({
      status: 201,
      description: '질문 개선 성공',
      schema: {
        example: {
          result: {
            question: '리마큐(Remacu)란 무엇인가요?',
          },
        },
      },
    }),
  );
