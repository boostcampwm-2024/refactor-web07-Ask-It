import axios from 'axios';
import { z } from 'zod';

import { DeleteQuestionRequestDTO } from '@/features/delete-question';

export const DeleteReplyRequestSchema = z.object({
  sessionId: z.string(),
  token: z.string(),
});

export type DeleteReplyRequestDTO = z.infer<typeof DeleteReplyRequestSchema>;

export const deleteReply = (replyId: number, params: DeleteQuestionRequestDTO) =>
  axios
    .delete(`/api/replies/${replyId}`, {
      params: DeleteReplyRequestSchema.parse(params),
    })
    .then((res) => res.data);
