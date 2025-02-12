import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

import { ContentLengthValidator } from '@ai/utils/length-validator';
import { BaseDto } from '@common/base.dto';

export class ImproveQuestionDto extends BaseDto {
  @ApiProperty({
    example: '리마큐가 뭐임?',
    description: '질문 본문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '질문 본문은 필수입니다.' })
  @Validate(ContentLengthValidator, [500])
  body: string;
}
