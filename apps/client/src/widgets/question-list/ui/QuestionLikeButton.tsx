import { GrLike, GrLikeFill } from 'react-icons/gr';

import { Button } from '@/shared/ui/button';

function QuestionLikeButton({
  liked,
  likesCount,
  onClick,
}: {
  liked: boolean;
  likesCount: number;
  onClick: () => void;
}) {
  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        {liked ? <GrLikeFill style={{ fill: 'rgb(165 180 252)' }} /> : <GrLike />}
        <span>{likesCount}</span>
      </div>
    </Button>
  );
}

export default QuestionLikeButton;
