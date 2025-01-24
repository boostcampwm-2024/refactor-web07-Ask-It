import { GoCheck } from 'react-icons/go';
import Markdown from 'react-markdown';

import { Button } from '@/shared/ui/button';

function QuestionBody({
  body,
  closed,
  isHost,
  expired,
  onClose,
}: {
  body: string;
  closed: boolean;
  isHost: boolean;
  expired: boolean;
  onClose: () => void;
}) {
  return (
    <div className='flex h-fit flex-col items-start justify-start gap-2 self-stretch border-b border-gray-200 px-2.5 pb-4 pt-2.5'>
      <div className='inline-flex items-start justify-between gap-4 self-stretch'>
        <Markdown className='prose prose-stone flex h-full w-full flex-col justify-start gap-3 text-base font-medium leading-normal text-black prose-img:rounded-md'>
          {body}
        </Markdown>
        {!expired && (isHost || (!isHost && closed)) && (
          <Button
            onClick={onClose}
            className={`self-start transition-colors duration-200 ${
              closed ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
            }`}
          >
            <div className={`self-start text-base font-medium ${closed ? 'text-green-800' : 'text-red-800'}`}>
              <GoCheck />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuestionBody;
