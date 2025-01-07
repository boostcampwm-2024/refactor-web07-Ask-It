export const MOCK_DATE = new Date('2025-01-01T00:00:00.000Z');

export const MOCK_REPLY = {
  replyId: 1,
  body: 'Test reply',
  createUserToken: 'token',
  createdAt: MOCK_DATE,
  deleted: false,
  questionId: 1,
  sessionId: '123',
  createUserTokenEntity: {
    user: {
      userId: 1,
      nickname: 'TestUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: MOCK_DATE,
    },
  },
};

export const MOCK_CREATED_REPLY = {
  ...MOCK_REPLY,
  replyId: 2,
};

export const MOCK_UPDATED_REPLY = {
  ...MOCK_REPLY,
  body: 'Updated reply',
};

export const MOCK_REPLY_LIKE = {
  replyLikeId: 1,
  replyId: 1,
  createUserToken: 'token',
  reply: {
    replyId: 1,
    createUserToken: 'token',
    createdAt: MOCK_DATE,
    deleted: false,
    questionId: 1,
    body: 'Test reply',
    sessionId: '123',
  },
};

export const MOCK_SESSION_AUTH = {
  sessionId: '123',
  token: 'token',
  isHost: false,
  userId: 1,
};
