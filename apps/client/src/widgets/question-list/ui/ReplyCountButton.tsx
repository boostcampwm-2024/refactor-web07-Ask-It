import { RiQuestionAnswerLine } from 'react-icons/ri';

import { Button } from '@/shared/ui/button';

interface ReplyCountButtonProps {
  count: number;
  onClick: () => void;
}

function ReplyCountButton({ count, onClick }: Readonly<ReplyCountButtonProps>) {
  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        <RiQuestionAnswerLine />
        <span>답글 {count}</span>
      </div>
    </Button>
  );
}

export default ReplyCountButton;
