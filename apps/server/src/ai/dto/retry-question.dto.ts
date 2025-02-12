import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { ContentLengthValidator } from '@ai/utils/length-validator';
import { BaseDto } from '@common/base.dto';

export class RetryImproveDto extends BaseDto {
  @ApiProperty({
    example: '호날두 vs 메시',
    description: '원본 질문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '원본 질문은 필수입니다.' })
  @Validate(ContentLengthValidator, [500])
  original: string;

  @ApiProperty({
    example: '## 축구선수 질문입니다. ### 호날두와 메시 중 더 뛰어난 축구선수가 누굽니까?',
    description: '개선할 질문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '개선할 질문 내용은 필수입니다.' })
  @Validate(ContentLengthValidator, [500])
  received: string;

  @ApiProperty({
    example: '말투를 더 완곡하게 변경해주세요.',
    description: '질문 개선 시 추가 요청할 내용 (비어있다면 빈 문자열로 보내주세요.)',
    required: true,
  })
  @IsString()
  @Validate(ContentLengthValidator, [150])
  retryMessage: string;
}
