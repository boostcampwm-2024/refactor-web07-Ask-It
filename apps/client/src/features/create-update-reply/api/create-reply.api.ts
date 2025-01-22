import axios from 'axios';
import { z } from 'zod';

export const PostReplyRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  questionId: z.number(),
  body: z.string().min(1),
});

export const PostReplyResponseSchema = z.object({
  reply: z.object({
    replyId: z.number(),
    body: z.string(),
    createdAt: z.string(),
    isOwner: z.boolean(),
    likesCount: z.number(),
    liked: z.boolean(),
    nickname: z.string(),
    isHost: z.boolean(),
  }),
});

export type PostReplyRequestDTO = z.infer<typeof PostReplyRequestSchema>;

export type PostReplyResponseDTO = z.infer<typeof PostReplyResponseSchema>;

export const postReply = (body: PostReplyRequestDTO) =>
  axios
    .post<PostReplyResponseDTO>(`/api/replies`, PostReplyRequestSchema.parse(body))
    .then((res) => PostReplyResponseSchema.parse(res.data));
