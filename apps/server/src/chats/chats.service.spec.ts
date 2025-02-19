import { Test, TestingModule } from '@nestjs/testing';

import { ChatsRepository } from './chats.repository';
import { ChatsService } from './chats.service';
import { MOCK_CHAT_DATA, MOCK_CHAT_DATA_NO_NICKNAME } from './test-chats.mock';

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

  describe('getChatsForInfiniteScroll', () => {
    it('무한 스크롤을 위한 채팅 목록을 조회해야 한다', async () => {
      const sessionId = '123';
      const count = 10;
      const chatId = 5;

      chatsRepository.getChatsForInfiniteScroll.mockResolvedValue(MOCK_CHAT_DATA);

      const result = await service.getChatsForInfiniteScroll(sessionId, count, chatId);

      expect(result).toEqual([
        { chattingId: 10, nickname: 'User1', content: 'Message 1', abuse: false },
        { chattingId: 9, nickname: 'User2', content: 'Message 2', abuse: true },
      ]);
    });

    it('무한 스크롤 조회 시 사용자의 닉네임이 없는 경우 "익명"을 반환해야 한다', async () => {
      const sessionId = '123';
      const count = 10;
      const chatId = 5;

      chatsRepository.getChatsForInfiniteScroll.mockResolvedValue(MOCK_CHAT_DATA_NO_NICKNAME);

      const result = await service.getChatsForInfiniteScroll(sessionId, count, chatId);

      expect(result).toEqual([{ chattingId: 10, nickname: '익명', content: 'Message 1', abuse: false }]);
    });
  });
});
