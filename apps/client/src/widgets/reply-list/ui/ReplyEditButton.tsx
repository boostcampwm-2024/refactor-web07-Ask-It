import { FiEdit2 } from 'react-icons/fi';

import { Button } from '@/shared/ui/button';

function ReplyEditButton({ isOwner, onClick }: { isOwner: boolean; onClick: () => void }) {
  if (!isOwner) return null;

  return (
    <Button className='bg-gray-200/25 hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <FiEdit2 />
    </Button>
  );
}

export default ReplyEditButton;
