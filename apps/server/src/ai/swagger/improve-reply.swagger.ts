import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ImproveReplySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '답변 개선' }),
    ApiResponse({
      status: 201,
      description: '답변 개선 성공',
      schema: {
        example: {
          result: {
            reply: '리마큐(Remacu)란 Real MySQL 8.0이라는 서적입니다.',
          },
        },
      },
    }),
  );
