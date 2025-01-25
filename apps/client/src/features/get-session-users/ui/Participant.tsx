import { GrValidate } from 'react-icons/gr';

import { User } from '@/entities/session';

interface ParticipantProps {
  user: User;
  onSelect: () => void;
}

function Participant({ user: { nickname, isHost }, onSelect }: Readonly<ParticipantProps>) {
  return (
    <button onClick={onSelect} className='w-full cursor-pointer rounded hover:bg-gray-200'>
      <div className='flex w-full flex-row items-center gap-2 p-2'>
        <GrValidate className={`flex-shrink-0 ${isHost ? 'text-indigo-600' : 'text-black-200'}`} />
        <span className='font-medium'>{nickname}</span>
      </div>
    </button>
  );
}

export default Participant;
