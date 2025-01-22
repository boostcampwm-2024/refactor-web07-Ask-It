import { useMutation } from '@tanstack/react-query';

import { postUser } from '@/features/sign-up/api/sign-up.api';
import { useSignUpForm } from '@/features/sign-up/model/useSignUpForm';

import { Button } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/InputField';
import { Modal, useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

function SignUpModal() {
  const addToast = useToastStore((state) => state.addToast);

  const { closeModal } = useModalContext();

  const {
    email,
    setEmail,
    nickname,
    setNickname,
    password,
    setPassword,
    emailValidationStatus,
    nicknameValidationStatus,
    passwordValidationStatus,
    isSignUpEnabled,
  } = useSignUpForm();

  const { mutate: signUpQuery, isPending } = useMutation({
    mutationFn: () => postUser({ email, nickname, password }),
    onSuccess: () => {
      closeModal();
      addToast({
        type: 'SUCCESS',
        message: '회원가입 되었습니다.',
        duration: 3000,
      });
    },
    onError: () => {
      closeModal();
      addToast({
        type: 'ERROR',
        message: '회원가입에 실패했습니다.',
        duration: 3000,
      });
    },
  });

  const handleSignUp = () => {
    if (!isSignUpEnabled || isPending) return;
    signUpQuery();
  };

  const isSignUpButtonEnabled = isSignUpEnabled && !isPending;

  return (
    <Modal>
      <Modal.Header className='justify-center'>
        <div className='font-header text-2xl'>
          <span className='text-indigo-600'>A</span>
          <span className='text-black'>sk-It</span>
        </div>
      </Modal.Header>
      <Modal.Body className='w-[20dvw]'>
        <InputField
          label='이메일'
          type='email'
          value={email}
          onChange={setEmail}
          placeholder='example@gmail.com'
          validationStatus={emailValidationStatus}
        />
        <InputField
          label='닉네임'
          type='text'
          value={nickname}
          onChange={setNickname}
          placeholder='닉네임을 입력해주세요'
          validationStatus={nicknameValidationStatus}
        />
        <InputField
          label='비밀번호'
          type='password'
          value={password}
          onChange={setPassword}
          placeholder='비밀번호를 입력해주세요'
          validationStatus={passwordValidationStatus}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className='bg-gray-500' onClick={closeModal}>
          <div className='w-[150px] text-sm font-medium text-white'>취소하기</div>
        </Button>
        <Button
          disabled={!isSignUpButtonEnabled}
          className={`transition-colors duration-200 ${isSignUpButtonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={handleSignUp}
        >
          <div className='w-[150px] text-sm font-medium text-white'>회원 가입</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignUpModal;
