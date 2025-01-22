import { PropsWithChildren } from 'react';

function Modal({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`flex h-fit min-h-[195px] w-fit min-w-[475px] flex-col items-center justify-center gap-2.5 rounded-lg bg-gray-50 p-8 shadow ${className}`}
    >
      {children}
    </div>
  );
}

function Header({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <header className={`flex w-full ${className}`}>{children}</header>;
}

function Body({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`flex w-full flex-col gap-4 py-4 ${className}`}>{children}</div>;
}

function Footer({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <footer className={`flex w-full justify-center gap-2.5 ${className}`}>{children}</footer>;
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
