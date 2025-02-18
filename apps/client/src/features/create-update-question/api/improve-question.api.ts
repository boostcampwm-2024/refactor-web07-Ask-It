import { z } from 'zod';

export const QuestionImprovementRequestSchema = z.object({
  token: z.string(),
  sessionId: z.string(),
  body: z.string().min(0),
});

export type QuestionImprovementRequest = z.infer<typeof QuestionImprovementRequestSchema>;

export const postQuestionImprovementStream = async (
  body: QuestionImprovementRequest,
  onMessage: (message: { type: string; content: string }) => void,
  onComplete?: () => void,
  onError?: (error: unknown) => void,
) => {
  const response = await fetch('/api/ai/question-improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(QuestionImprovementRequestSchema.parse(body)),
  });
  if (!response.body) throw new Error('ReadableStream not supported');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const processLine = (line: string): void => {
    if (!line.trim()) return;
    try {
      const parsed = JSON.parse(line);
      if (parsed.type === 'stream') {
        onMessage(parsed);
      }
    } catch (error) {
      if (onError) onError(error);
    }
  };

  try {
    let result = await reader.read();
    while (!result.done) {
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        processLine(line);
      }
      result = await reader.read();
    }
    if (onComplete) onComplete();
  } catch (error) {
    if (onError) onError(error);
  }
};
