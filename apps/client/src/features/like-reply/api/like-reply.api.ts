import axios from 'axios';
import { z } from 'zod';

export const PostQuestionLikeRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
});

export const PostQuestionLikeResponseSchema = z.object({
  liked: z.boolean(),
  likesCount: z.number(),
});

export type PostQuestionLikeRequestDTO = z.infer<typeof PostQuestionLikeRequestSchema>;

export type PostQuestionLikeResponseDTO = z.infer<typeof PostQuestionLikeResponseSchema>;

export const postReplyLike = (replyId: number, body: PostQuestionLikeRequestDTO) =>
  axios
    .post<PostQuestionLikeResponseDTO>(`/api/replies/${replyId}/likes`, PostQuestionLikeRequestSchema.parse(body))
    .then((res) => PostQuestionLikeResponseSchema.parse(res.data));
