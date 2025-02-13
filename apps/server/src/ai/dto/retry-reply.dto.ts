import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { ContentLengthValidator } from '@ai/utils/length-validator';
import { BaseDto } from '@common/base.dto';

export class RetryImproveReplyDto extends BaseDto {
  @ApiProperty({
    example: '리마큐란 무엇인가요?',
    description: '답변을 하기 위한 질문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(ContentLengthValidator, [500, 1])
  originalQuestion: string;

  @ApiProperty({
    example: '리마큐란 Real MySQL이라는 서적임ㅇㅇ',
    description: '원본 답변 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '원본 답변 필수입니다.' })
  @Validate(ContentLengthValidator, [500, 1])
  original: string;

  @ApiProperty({
    example: '리마큐(Real MySQL)이란 서적입니다.',
    description: '개선할 답변 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '개선할 답변 내용은 필수입니다.' })
  @Validate(ContentLengthValidator, [500, 1])
  received: string;

  @ApiProperty({
    example: 'MySQL 8.0버전임을 명시해주세요.',
    description: '답변 개선 시 추가 요청할 내용 (비어있다면 빈 문자열로 보내주세요.)',
    required: true,
  })
  @IsString()
  @Validate(ContentLengthValidator, [150, 0])
  retryMessage: string;
}
