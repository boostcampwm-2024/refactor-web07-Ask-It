import Markdown from 'react-markdown';

import { Question } from '@/entities/session';

interface QuestionPreviewProps {
  question?: Question;
}

function QuestionPreview({ question }: Readonly<QuestionPreviewProps>) {
  if (!question) return null;

  return (
    <div className='max-h-[20dvh] overflow-y-auto border-gray-200 py-2'>
      <Markdown className='prose prose-stone'>{question.body}</Markdown>
    </div>
  );
}

export default QuestionPreview;
