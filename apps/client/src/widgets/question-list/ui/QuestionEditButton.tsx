import { FiEdit2 } from 'react-icons/fi';

import { Button } from '@/shared/ui/button';

interface QuestionEditButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

function QuestionEditButton({ isVisible, onClick }: Readonly<QuestionEditButtonProps>) {
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
