import { Test, TestingModule } from '@nestjs/testing';
import { AbuseState } from '@prisma/client';

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
  let fetchMock: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: ChatsRepository,
          useValue: {
            save: jest.fn(),
            getChatsForInfiniteScroll: jest.fn(),
            getChatsForFilter: jest.fn(), // 추가
            update: jest.fn(), // 추가
          },
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatsRepository = module.get(ChatsRepository);

    fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ predicted: '일반어', probability: 0.9 })),
      } as Response),
    );
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
        abuse: false,
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
        abuse: false,
      });
    });
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

  describe('detectAbuseBatch', () => {
    it('새로운 채팅들을 필터링하고 상태를 업데이트해야 한다', async () => {
      const SAFE_WORD = 'Hello';
      const BAD_WORD = 'Bad word';

      const mockChats = [
        { ...MOCK_SAVED_CHAT, chattingId: 1, body: SAFE_WORD },
        { ...MOCK_SAVED_CHAT, chattingId: 2, body: BAD_WORD },
      ];

      chatsRepository.getChatsForFilter.mockResolvedValue(mockChats);

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ predicted: '일반어', probability: 0.9 })),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(JSON.stringify({ predicted: '욕설', probability: 0.9 })),
        } as Response);

      await service.detectAbuseBatch();

      expect(chatsRepository.update).toHaveBeenCalledWith(1, AbuseState.SAFE);
      expect(chatsRepository.update).toHaveBeenCalledWith(2, AbuseState.BLOCKED);
    });
  });

  describe('checkAbuse', () => {
    it('욕설이 감지되면 true를 반환해야 한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ predicted: '욕설', probability: 0.9 })),
      } as Response);

      const result = await service.checkAbuse('욕설 내용');
      expect(result).toBe(true);
    });

    it('일반어가 감지되면 false를 반환해야 한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ predicted: '일반어', probability: 0.9 })),
      } as Response);

      const result = await service.checkAbuse('일반 내용');
      expect(result).toBe(false);
    });

    it('API 요청이 실패하면 false를 반환해야 한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      const result = await service.checkAbuse('테스트 내용');
      expect(result).toBe(false);
    });

    it('네트워크 에러가 발생하면 false를 반환해야 한다', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.checkAbuse('테스트 내용');
      expect(result).toBe(false);
    });
  });
});
