import { IsNotEmpty } from 'class-validator';

export class AbuseChattingDto {
  @IsNotEmpty({ message: '데이터는 필수입니다.' })
  abuseChattings: { chattingId: number; sessionId: string }[];
}
