import { Button } from '@/shared/ui/button';

interface ReplyModalFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitText: string;
}

function ReplyModalFooter({ onClose, onSubmit, submitDisabled, submitText }: Readonly<ReplyModalFooterProps>) {
  return (
    <footer className='flex justify-end gap-2.5'>
      <Button className='bg-gray-500' onClick={onClose}>
        <div className='text-sm font-bold text-white'>취소하기</div>
      </Button>
      <Button
        className={`${!submitDisabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
        onClick={onSubmit}
      >
        <div className='text-sm font-bold text-white'>{submitText}</div>
      </Button>
    </footer>
  );
}

export default ReplyModalFooter;
