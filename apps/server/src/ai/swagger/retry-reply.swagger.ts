import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RetryReplySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '답변 개선작업 재요청' }),
    ApiResponse({
      status: 201,
      description: '답변 개선작업 재요청 성공',
      schema: {
        example: {
          result: {
            reply: '## Real MySQL 8.0버전의 서적입니다.',
          },
        },
      },
    }),
  );
