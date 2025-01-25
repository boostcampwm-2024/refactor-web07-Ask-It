import Markdown from 'react-markdown';

interface QuestionContentEditorProps {
  body: string;
  setBody: (value: string) => void;
}

function QuestionContentEditor({ body, setBody }: Readonly<QuestionContentEditorProps>) {
  return (
    <div className='flex h-full gap-2.5'>
      <textarea
        className='h-full flex-1 resize-none rounded border p-4 focus:outline-none'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`**질문을 남겨주세요**\n**(마크다운 지원)**`}
      />
      <div className='flex-1 overflow-y-auto rounded border p-4'>
        <Markdown className='prose prose-stone'>
          {body.length === 0 ? `**질문을 남겨주세요**\n\n**(마크다운 지원)**` : body}
        </Markdown>
      </div>
    </div>
  );
}

export default QuestionContentEditor;
