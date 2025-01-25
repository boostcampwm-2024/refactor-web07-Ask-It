import { GrPin } from 'react-icons/gr';

import { Button } from '@/shared/ui/button';

interface QuestionPinButtonProps {
  isHost: boolean;
  expired: boolean;
  pinned: boolean;
  onClick: () => void;
}

function QuestionPinButton({ isHost, expired, pinned, onClick }: Readonly<QuestionPinButtonProps>) {
  if (expired || !isHost) return null;

  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        <GrPin />
        <span>{pinned ? '고정 해제' : '고정'}</span>
      </div>
    </Button>
  );
}

export default QuestionPinButton;
