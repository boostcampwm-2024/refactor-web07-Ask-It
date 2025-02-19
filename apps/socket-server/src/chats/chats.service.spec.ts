import { LoggerService } from '@logger/logger.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AbuseState } from '@prisma/client';

import { ChatEvents } from './chat.event';
import { ChatsRepository } from './chats.repository';
import { ChatSaveDto, ChatsService } from './chats.service';
import { MOCK_SAVED_CHAT, MOCK_SAVED_CHAT_NO_NICKNAME } from './test-chats.mock';

describe('ChatsService', () => {
  let service: ChatsService;
  let chatsRepository: jest.Mocked<ChatsRepository>;
  let chatEvents: jest.Mocked<ChatEvents>;
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
            getChatsForFilter: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: ChatEvents,
          useValue: {
            emitAbuseDetected: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatsRepository = module.get(ChatsRepository);
    chatEvents = module.get(ChatEvents);

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

  describe('detectAbuseBatch', () => {
    it('새로운 채팅들을 필터링하고 상태를 업데이트해야 한다', async () => {
      const SAFE_WORD = 'Hello';
      const BAD_WORD = 'Bad word';

      const mockChats = [
        { ...MOCK_SAVED_CHAT, chattingId: 1, body: SAFE_WORD },
        { ...MOCK_SAVED_CHAT, chattingId: 2, body: BAD_WORD },
      ];

      chatsRepository.getChatsForFilter.mockResolvedValue(mockChats);

      fetchMock.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(
              JSON.stringify({
                predictions: [
                  { predicted: '일반어', probability: 0.9 },
                  { predicted: '욕설', probability: 0.99 },
                ],
              }),
            ),
        } as Response),
      );

      await service.detectAbuseBatch();

      expect(chatsRepository.update).toHaveBeenCalledWith(1, AbuseState.SAFE);
      expect(chatsRepository.update).toHaveBeenCalledWith(2, AbuseState.BLOCKED);
    });
  });
});
