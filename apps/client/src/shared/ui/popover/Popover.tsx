import { PropsWithChildren, useState } from 'react';

const positionClasses = {
  top: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1',
  bottom: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-1',
  left: 'absolute right-full top-1/2 transform -translate-y-1/2 mr-1',
  right: 'absolute left-full top-1/2 transform -translate-y-1/2 ml-1',
  'top-left': 'absolute bottom-full left-0 mb-1',
  'top-right': 'absolute bottom-full right-0 mb-1',
  'bottom-left': 'absolute top-full left-0 mt-1',
  'bottom-right': 'absolute top-full right-0 mt-1',
};

interface PopoverProps extends PropsWithChildren {
  className?: string;
  text: string;
  enabled?: boolean;
  position?: keyof typeof positionClasses;
}

export default function Popover({ children, className, text, enabled, position = 'bottom' }: Readonly<PopoverProps>) {
  const [isVisible, setIsVisible] = useState(enabled ?? false);

  const handleMouseEnter = () => {
    if (enabled === undefined) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (enabled === undefined) {
      setIsVisible(false);
    }
  };

  const actualVisible = enabled !== undefined ? enabled : isVisible;

  return (
    <div className={`${className} relative`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <div
        className={`${positionClasses[position]} flex w-max items-center justify-center break-words rounded-md border bg-white p-2 text-sm shadow-md transition-opacity duration-200 ease-in-out ${actualVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {text}
      </div>
    </div>
  );
}
