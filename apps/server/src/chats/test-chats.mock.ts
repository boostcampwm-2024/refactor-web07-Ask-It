export const MOCK_DATE = new Date('2024-01-01T00:00:00.000Z');

export const MOCK_USER = {
  userId: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  nickname: 'TestUser',
  createdAt: MOCK_DATE,
};

export const MOCK_SAVED_CHAT = {
  chattingId: 1,
  sessionId: 'test-session',
  createUserToken: 'mockToken',
  body: 'Test chat message',
  createdAt: MOCK_DATE,
  createUserTokenEntity: {
    user: { ...MOCK_USER },
  },
};

export const MOCK_SAVED_CHAT_NO_NICKNAME = {
  chattingId: 1,
  createUserTokenEntity: {
    user: {
      createdAt: new Date(),
      userId: 123,
      email: 'user@example.com',
      password: 'password',
      nickname: null,
    },
  },
  createUserToken: 'token123',
  sessionId: 'session123',
  body: 'Test message',
  createdAt: new Date(),
};

export const MOCK_CHAT_DATA = [
  {
    chattingId: 10,
    createUserToken: 'token1',
    body: 'Message 1',
    createdAt: new Date(),
    sessionId: '123',
    createUserTokenEntity: {
      user: {
        userId: 1,
        createdAt: new Date(),
        email: 'user1@example.com',
        password: 'password1',
        nickname: 'User1',
      },
      token: 'token1',
      userId: 1,
      sessionId: '123',
      isHost: true,
    },
  },
  {
    chattingId: 9,
    createUserToken: 'token2',
    body: 'Message 2',
    createdAt: new Date(),
    sessionId: '123',
    createUserTokenEntity: {
      user: {
        userId: 2,
        createdAt: new Date(),
        email: 'user2@example.com',
        password: 'password2',
        nickname: 'User2',
      },
      token: 'token2',
      userId: 2,
      sessionId: '123',
      isHost: false,
    },
  },
];

export const MOCK_CHAT_DATA_NO_NICKNAME = [
  {
    chattingId: 10,
    body: 'Message 1',
    createUserToken: 'token1',
    createdAt: new Date(),
    sessionId: '123',
    createUserTokenEntity: {
      user: {
        userId: 1,
        createdAt: new Date(),
        email: 'test@example.com',
        password: 'password',
        nickname: null,
      },
      token: 'token1',
      userId: 1,
      sessionId: '123',
      isHost: false,
    },
  },
];
