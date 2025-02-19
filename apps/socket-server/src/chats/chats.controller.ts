import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChatsService } from './chats.service';

@Controller('chats')
@ApiTags('Chats')
export class ChatsController {
  private readonly CHAT_FETCH_LIMIT = 20;

  constructor(private readonly chatsService: ChatsService) {}
}
