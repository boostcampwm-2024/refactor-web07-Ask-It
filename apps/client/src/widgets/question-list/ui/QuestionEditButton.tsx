import { FiEdit2 } from 'react-icons/fi';

import { Button } from '@/shared/ui/button';

function QuestionEditButton({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  if (!isVisible) return null;

  return (
    <Button
      className='bg-gray-200/25 font-medium text-gray-500 hover:bg-gray-200/50 hover:transition-all'
      onClick={onClick}
    >
      <FiEdit2 />
    </Button>
  );
}

export default QuestionEditButton;
