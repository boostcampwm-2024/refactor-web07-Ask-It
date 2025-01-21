import { useSignInForm } from '@/features/auth';
import { useModalContext } from '@/features/modal';

import Button from '../Button';

import InputField from '@/components/modal/InputField';
import Modal from '@/components/modal/Modal';

function SignInModal() {
  const { closeModal } = useModalContext();

  const { email, setEmail, password, setPassword, isLoginEnabled, handleLogin, loginFailed } = useSignInForm();

  const login = () => {
    if (isLoginEnabled) handleLogin(() => closeModal());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      login();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  };

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
          onKeyDown={handleKeyDown}
          onChange={setEmail}
          placeholder='example@gmail.com'
        />
        <InputField
          label='비밀번호'
          type='password'
          value={password}
          onKeyDown={handleKeyDown}
          onChange={setPassword}
          placeholder='비밀번호를 입력해주세요'
          validationStatus={loginFailed}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className='bg-gray-500' onClick={closeModal}>
          <div className='w-[150px] text-sm font-medium text-white'>취소하기</div>
        </Button>
        <Button
          disabled={!isLoginEnabled}
          className={`transition-colors duration-200 ${isLoginEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={login}
        >
          <div className='w-[150px] text-sm font-medium text-white'>로그인</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignInModal;
