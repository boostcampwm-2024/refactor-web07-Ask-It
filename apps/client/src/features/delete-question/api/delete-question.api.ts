import axios from 'axios';
import { z } from 'zod';

export const DeleteQuestionRequestSchema = z.object({
  sessionId: z.string(),
  token: z.string(),
});

export type DeleteQuestionRequestDTO = z.infer<typeof DeleteQuestionRequestSchema>;

export const deleteQuestion = (questionId: number, params: DeleteQuestionRequestDTO) =>
  axios
    .delete(`/api/questions/${questionId}`, {
      params: DeleteQuestionRequestSchema.parse(params),
    })
    .then((res) => res.data);
