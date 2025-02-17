import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const RetryReplySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: '답변 개선작업 재요청' }),
    ApiResponse({
      status: 201,
      description: '답변 개선작업 재요청 성공',
      schema: {
        example: [
          { type: 'stream', content: ' 구체' },
          { type: 'stream', content: '적인' },
          { type: 'stream', content: ' 방안' },
          { type: 'stream', content: ' 알려' },
          { type: 'stream', content: '주세요' },
          { type: 'stream', content: '!' },
          {
            type: 'result',
            content:
              '# 서비스 전후 개선 작성\n:\n 기존에는 단일 서버에서 운영되던 서비스였습니다.\n는 확장 가능 서비스 구조로하고자 합니다\n하지만 경우, 확장 가능한 부분은으로 설명할 수 있지만, 성능 서버를 늘 접속 늘릴 수 때문적 성능 지표 도출 어렵습니다.\n이런에서 이후 사항 어떻게 작성하면 좋을지 구체적인 방안 알려주세요!# 서비스 확장 전후 개선 방안 작성 방법\n\n상황:\n- 기존에는 단일 서버에서 운영되던 서비스였습니다.\n- 이제는 확장 가능한 서비스 구조로 전환하고자 합니다.\n\n하지만 이 경우, 확장 가능한 부분은 기술적으로 설명할 수 있지만, 성능 측면에서는 서버 수를 늘리면 동시 접속자를 늘릴 수 있기 때문에 정량적 성능 지표를 도출하기 어렵습니다.\n\n이런 상황에서 이전과 이후의 개선 사항을 어떻게 작성하면 좋을지 구체적인 방안이나 아이디어가 있다면 알려주세요!',
          },
        ],
      },
    }),
  );
