import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseDto } from '@common/base.dto';

export class ShortenQuestionDto extends BaseDto {
  @ApiProperty({
    example: '리마큐가 뭐임?',
    description: '질문 본문 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '질문 본문은 필수입니다.' })
  body: string;
}
