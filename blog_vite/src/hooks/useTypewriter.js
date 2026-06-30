import { useEffect, useState } from 'react';

/**
 * Typewriter effect: cycles through `texts`, typing and deleting each.
 */
export default function useTypewriter(texts, { typeSpeed = 80, backSpeed = 50, pause = 1000 } = {}) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!texts.length) return;
    let textIndex = 0, charIndex = 0, deleting = false, paused = false, alive = true, timer;

    const step = () => {
      if (!alive) return;
      const cur = texts[textIndex];
      setText(cur.substring(0, charIndex));

      let delay = typeSpeed;
      if (!deleting) {
        if (charIndex < cur.length) {
          charIndex++;
        } else if (!paused) {
          paused = true;
          timer = setTimeout(() => { deleting = true; paused = false; step(); }, pause);
          return;
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
          const c = cur.charAt(charIndex);
          delay = c === ' ' ? 0 : backSpeed;
        } else {
          deleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }
      timer = setTimeout(step, delay);
    };

    step();
    return () => { alive = false; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return text;
}
