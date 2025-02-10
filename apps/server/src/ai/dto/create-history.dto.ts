import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateHistoryDto {
  @ApiProperty({
    example: 'IMPROVE_QUESTION',
    description: '프롬프트 종류',
    required: true,
  })
  @IsIn(['IMPROVE_QUESTION', 'SHORTEN_QUESTION'], {
    message: 'promptName은 IMPROVE_QUESTION 또는 SHORTEN_QUESTION이어야 합니다.',
  })
  @IsNotEmpty()
  promptName: string;

  @ApiProperty({
    example: '호날두 VS 메시',
    description: 'AI 수정 전의 원본',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  request: string;

  @ApiProperty({
    example: '호날두와 메시 중 누가 더 뛰어난 축구선수인가요?',
    description: 'AI 수정 후의 결과',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiProperty({
    example: 'ACCEPT',
    description: '사용자 반응',
    required: true,
  })
  @IsIn(['ACCEPT', 'REJECT'], {
    message: 'result는 ACCEPT 또는 REJECT이어야 합니다.',
  })
  @IsNotEmpty()
  result: string;
}
