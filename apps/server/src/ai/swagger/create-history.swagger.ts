import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const CreateHistorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'AI 제안을 사용자가 accept/rejet했는지를 저장합니다.' }),
    ApiResponse({
      status: 201,
      description: 'history 저장 성공',
    }),
  );
