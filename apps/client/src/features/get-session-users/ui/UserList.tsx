import { IoClose } from 'react-icons/io5';

import Participant from '@/features/get-session-users/ui/Participant';
import SearchBar from '@/features/get-session-users/ui/SearchBar';

import { User } from '@/entities/session';

import { Modal } from '@/shared/ui/modal';

interface UserListProps {
  users: User[];
  searchQuery: string;
  onSearch: (value: string) => void;
  onSelectUser: (userId: number) => void;
  onClose: () => void;
}

function UserList({ users, searchQuery, onSearch, onSelectUser, onClose }: Readonly<UserListProps>) {
  return (
    <Modal>
      <Modal.Header className='flex-row items-center justify-between border-b border-gray-200 pb-2'>
        <span className='text-lg font-bold'>세션 참여자 정보</span>
        <IoClose
          size={24}
          className='cursor-pointer text-rose-600 transition-transform duration-100 hover:scale-110'
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Body className='h-[25dvh] gap-2'>
        <SearchBar value={searchQuery} onChange={onSearch} />
        <ol className='flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden'>
          {users.map((user) => (
            <Participant key={user.userId} user={user} onSelect={() => onSelectUser(user.userId)} />
          ))}
        </ol>
      </Modal.Body>
    </Modal>
  );
}

export default UserList;
