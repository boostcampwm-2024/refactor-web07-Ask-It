import { useSessionParticipants } from '@/features/get-session-users/model/useSessionParticipants';
import ConfirmHostChangeModal from '@/features/get-session-users/ui/ConfirmHostChangeModal';
import UserList from '@/features/get-session-users/ui/UserList';

function SessionParticipantsModal() {
  const { selectedUser, filteredUsers, searchQuery, setSearchQuery, setSelectedUserId, handleToggleHost, closeModal } =
    useSessionParticipants();

  return selectedUser ? (
    <ConfirmHostChangeModal
      user={selectedUser}
      onCancel={() => setSelectedUserId(undefined)}
      onConfirm={handleToggleHost}
    />
  ) : (
    <UserList
      users={filteredUsers}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onSelectUser={setSelectedUserId}
      onClose={closeModal}
    />
  );
}

export default SessionParticipantsModal;
