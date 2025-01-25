import Markdown from 'react-markdown';

interface ReplyContentEditorProps {
  body: string;
  setBody: (value: string) => void;
}

function ReplyContentEditor({ body, setBody }: Readonly<ReplyContentEditorProps>) {
  return (
    <div className='flex h-full gap-2.5'>
      <textarea
        className='h-full flex-1 resize-none rounded border p-4 focus:outline-none'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`**답변을 남겨주세요**\n**(마크다운 지원)**`}
      />
      <div className='flex-1 overflow-y-auto rounded border p-4'>
        <Markdown className='prose prose-stone'>
          {body.length === 0 ? `**답변을 남겨주세요**\n\n**(마크다운 지원)**` : body}
        </Markdown>
      </div>
    </div>
  );
}

export default ReplyContentEditor;
