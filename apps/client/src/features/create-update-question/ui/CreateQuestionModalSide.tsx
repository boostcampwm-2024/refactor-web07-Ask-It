import { VscEdit, VscMarkdown } from 'react-icons/vsc';

interface CreateQuestionModalSideProps {
  bodyLength: number;
  openPreview: boolean;
  setOpenPreview: (openPreview: boolean) => void;
}

const textSize = (bodyLength: number) => {
  if (bodyLength >= 10000) {
    return 'text-[0.5rem] leading-3';
  } else if (bodyLength >= 1000) {
    return 'text-xs';
  }
  return 'text-sm';
};

export default function CreateQuestionModalSide({
  bodyLength,
  openPreview,
  setOpenPreview,
}: Readonly<CreateQuestionModalSideProps>) {
  return (
    <div className='absolute right-8 flex h-[calc(100%-5rem)] w-12 flex-col items-center justify-between py-4'>
      <button
        className='flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-md'
        onClick={() => setOpenPreview(!openPreview)}
      >
        {openPreview ? <VscEdit size={32} /> : <VscMarkdown size={32} />}
      </button>
      <span className={`${bodyLength > 500 ? 'text-red-600' : 'text-slate-400'} ${textSize(bodyLength)}`}>
        {bodyLength}/500
      </span>
    </div>
  );
}
