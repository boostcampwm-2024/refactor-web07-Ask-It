import { GrClose } from 'react-icons/gr';

import { Button } from '@/shared/ui/button';

function ReplyDeleteButton({ canDelete, onClick }: { canDelete: boolean; onClick: () => void }) {
  if (!canDelete) return null;

  return (
    <Button className='bg-red-200/25 text-red-600 hover:bg-red-200/50 hover:transition-all' onClick={onClick}>
      <GrClose />
    </Button>
  );
}

export default ReplyDeleteButton;
