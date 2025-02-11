import { PropsWithChildren, useState } from 'react';

interface PopoverProps extends PropsWithChildren {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Popover({ children, text, position = 'bottom' }: Readonly<PopoverProps>) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    bottom: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'absolute right-full top-1/2 transform -translate-y-1/2 mr-1',
    right: 'absolute left-full top-1/2 transform -translate-y-1/2 ml-1',
  };

  return (
    <div className='relative' onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <div
        className={`${positionClasses[position]} flex w-max items-center justify-center break-words rounded-md border bg-white p-2 text-sm shadow-md transition-opacity duration-200 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {text}
      </div>
    </div>
  );
}
