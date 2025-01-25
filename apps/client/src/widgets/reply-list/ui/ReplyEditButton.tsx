import { FiEdit2 } from 'react-icons/fi';

import { Button } from '@/shared/ui/button';

interface ReplyEditButtonProps {
  isOwner: boolean;
  onClick: () => void;
}

function ReplyEditButton({ isOwner, onClick }: Readonly<ReplyEditButtonProps>) {
  if (!isOwner) return null;

  return (
    <Button className='bg-gray-200/25 hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <FiEdit2 />
    </Button>
  );
}

export default ReplyEditButton;
