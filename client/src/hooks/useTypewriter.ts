import { useState, useEffect } from 'react';

interface TypewriterOptions {
  typeSpeed?: number;
  pauseBetweenTexts?: number
}

function useTypewriter(texts: string[], options: TypewriterOptions = {}): string {
  const [index, setIndex] = useState<number>(0);
  const [subIndex, setSubIndex] = useState<number>(0);
  const [reverse, setReverse] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [pause, setPause] = useState<boolean>(false);

  useEffect(() => {
    if (pause) {
      const pauseTimeout = setTimeout(() => {
        setPause(false);
        setIndex((prev) => (prev + 1) % texts.length);
        setSubIndex(0);
        setReverse(false);
      }, options.pauseBetweenTexts || 2000);

      return () => clearTimeout(pauseTimeout);
    }

    if (subIndex === texts[index].length + 1 && !reverse) {
      setPause(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setPause(true);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
      setText(texts[index].substring(0, subIndex));
    }, options.typeSpeed || 200);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, options.typeSpeed, pause, options.pauseBetweenTexts]);

  return text;
}
export default useTypewriter