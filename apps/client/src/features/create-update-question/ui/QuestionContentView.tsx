import Markdown from 'react-markdown';

interface QuestionContentViewProps {
  supportResult: string | null;
  questionBody: string;
  openPreview: boolean;
  isWritingPending: boolean;
  onQuestionBodyChange: (body: string) => void;
}

export default function QuestionContentView({
  supportResult,
  questionBody,
  openPreview,
  isWritingPending,
  onQuestionBodyChange,
}: Readonly<QuestionContentViewProps>) {
  if (isWritingPending) {
    return (
      <div className='flex flex-1 items-center justify-center overflow-y-auto rounded border bg-white p-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
      </div>
    );
  }

  if (supportResult !== null) {
    if (openPreview) {
      return (
        <div className='flex-1 overflow-auto p-4'>
          <Markdown className='w-[calc(100%-3rem] prose prose-stone h-full break-words pr-[3rem]'>
            {supportResult}
          </Markdown>
        </div>
      );
    }
    return (
      <textarea
        className='flex-1 resize-none overflow-auto p-4 pr-[4rem] focus:outline-none'
        value={supportResult}
        readOnly={true}
      />
    );
  }

  if (openPreview) {
    return (
      <div className='h-full flex-1 overflow-auto p-4'>
        <Markdown className='w-[calc(100%-3rem] prose prose-stone h-full max-h-full break-words pr-[3rem]'>
          {questionBody}
        </Markdown>
      </div>
    );
  }

  return (
    <textarea
      className='flex-1 resize-none overflow-auto p-4 pr-[4rem] focus:outline-none'
      value={questionBody}
      onChange={(e) => onQuestionBodyChange(e.target.value)}
      placeholder='질문을 남겨주세요.'
    />
  );
}
