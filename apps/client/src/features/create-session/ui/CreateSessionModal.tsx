import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { postSession } from '@/features/create-session/api/create-session.api';

import { Button } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/InputField';
import { Modal, useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

function CreateSessionModal() {
  const addToast = useToastStore((state) => state.addToast);

  const { closeModal } = useModalContext();

  const [sessionName, setSessionName] = useState('');

  const navigate = useNavigate();

  const { mutate: postSessionQuery, isPending } = useMutation({
    mutationFn: postSession,
    onSuccess: (res) => {
      closeModal();
      addToast({
        type: 'SUCCESS',
        message: `세션(${sessionName})이 생성되었습니다.`,
        duration: 3000,
      });
      navigate({
        to: '/session/$sessionId',
        params: { sessionId: res.sessionId },
      });
    },
    onError: console.error,
  });

  const enableCreateSession = sessionName.trim().length >= 3 && sessionName.trim().length <= 20;

  const handleCreateSession = () => {
    if (!enableCreateSession || isPending) return;
    postSessionQuery({ title: sessionName });
  };

  return (
    <Modal>
      <Modal.Header className='justify-center'>
        <div className='font-header text-2xl'>
          <span className='text-indigo-600'>A</span>
          <span className='text-black'>sk-It</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <InputField
          label='세션 이름'
          type='text'
          value={sessionName}
          onChange={setSessionName}
          validationStatus={{
            status: sessionName.trim().length === 0 || enableCreateSession ? 'INITIAL' : 'INVALID',
            message: enableCreateSession ? '세션 이름을 입력해주세요' : '세션 이름은 3자 이상 20자 이하로 입력해주세요',
          }}
          placeholder='세션 이름을 입력해주세요'
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className='bg-gray-500' onClick={closeModal}>
          <div className='w-[150px] text-sm font-medium text-white'>취소하기</div>
        </Button>
        <Button
          className={`transition-colors duration-200 ${enableCreateSession ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={handleCreateSession}
        >
          <div className='w-[150px] text-sm font-medium text-white'>세션 생성하기</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateSessionModal;
