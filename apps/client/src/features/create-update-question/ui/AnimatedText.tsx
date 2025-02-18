import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

interface AnimatedTextProps {
  text: string;
  speed?: number;
  renderAsMarkdown?: boolean;
  onComplete?: () => void;
}

export default function AnimatedText({
  text,
  speed = 50,
  renderAsMarkdown = false,
  onComplete,
}: Readonly<AnimatedTextProps>) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = text.startsWith(displayed) ? displayed.length : 0;
    if (!text.startsWith(displayed)) setDisplayed('');
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  if (renderAsMarkdown) {
    return (
      <div className='h-full flex-1 overflow-auto p-4'>
        <Markdown className='prose prose-stone h-full max-h-full w-[calc(100%-3rem)] break-words pr-[3rem]'>
          {displayed}
        </Markdown>
      </div>
    );
  }

  return (
    <textarea
      className='flex-1 resize-none overflow-auto p-4 pr-[4rem] focus:outline-none'
      value={displayed}
      readOnly={true}
    />
  );
}
