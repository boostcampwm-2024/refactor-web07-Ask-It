import { Test, TestingModule } from '@nestjs/testing';

import { ChatsRepository } from './chats.repository';
import { ChatSaveDto, ChatsService } from './chats.service';
import {
  MOCK_CHAT_DATA,
  MOCK_CHAT_DATA_NO_NICKNAME,
  MOCK_SAVED_CHAT,
  MOCK_SAVED_CHAT_NO_NICKNAME,
} from './test-chats.mock';

describe('ChatsService', () => {
  let service: ChatsService;
  let chatsRepository: jest.Mocked<ChatsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: ChatsRepository,
          useValue: {
            save: jest.fn(),
            getChatsForInfiniteScroll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatsRepository = module.get(ChatsRepository);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('saveChat', () => {
    it('채팅을 저장하고 저장된 데이터를 반환해야 한다', async () => {
      const data: ChatSaveDto = {
        sessionId: '123',
        token: 'mockToken',
        body: 'Test message',
      };

      chatsRepository.save.mockResolvedValue(MOCK_SAVED_CHAT);

      const result = await service.saveChat(data);
      expect(chatsRepository.save).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        chattingId: 1,
        nickname: 'TestUser',
        content: 'Test chat message',
      });
    });

    it('사용자의 닉네임이 없는 경우 "익명"을 반환해야 한다', async () => {
      const data: ChatSaveDto = {
        sessionId: '123',
        token: 'mockToken',
        body: 'Test message',
      };

      chatsRepository.save.mockResolvedValue(MOCK_SAVED_CHAT_NO_NICKNAME);

      const result = await service.saveChat(data);

      expect(chatsRepository.save).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        chattingId: 1,
        nickname: '익명',
        content: 'Test message',
      });
    });
  });
});
