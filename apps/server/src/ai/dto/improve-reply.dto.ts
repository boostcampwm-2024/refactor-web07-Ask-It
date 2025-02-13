import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { ContentLengthValidator } from '@ai/utils/length-validator';
import { BaseDto } from '@common/base.dto';

export class ImproveReplyDto extends BaseDto {
  @ApiProperty({
    example: '리마큐란 Real MySQL 8.0이라는 서적입니다.',
    description: '답변 본문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '답변 본문은 필수입니다.' })
  @Validate(ContentLengthValidator, [500, 1])
  body: string;

  @ApiProperty({
    example: '리마큐가 무엇인가요?',
    description: '질문 본문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '질문 본문은 필수입니다.' })
  @Validate(ContentLengthValidator, [500, 1])
  originalQuestion: string;
}
