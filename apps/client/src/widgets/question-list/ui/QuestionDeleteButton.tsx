import { GrClose } from 'react-icons/gr';

import { Button } from '@/shared/ui/button';

function QuestionDeleteButton({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  if (!isVisible) return null;

  return (
    <Button className='bg-red-200/25 text-red-600 hover:bg-red-200/50 hover:transition-all' onClick={onClick}>
      <GrClose />
    </Button>
  );
}

export default QuestionDeleteButton;
