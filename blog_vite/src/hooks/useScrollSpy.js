import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-spy: given a list of heading ids, returns the id of the section
 * currently in the reading zone near the top of the viewport.
 */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] ?? null);
  const visible = useRef(new Set());

  useEffect(() => {
    if (!ids.length) return;
    setActive(ids[0]);
    visible.current = new Set();

    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const pickTopmost = () => {
      let best = null, bestTop = Infinity;
      for (const id of visible.current) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top < bestTop) { bestTop = top; best = id; }
      }
      if (best) setActive(best);
    };

    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.current.add(e.target.id);
        else visible.current.delete(e.target.id);
      }
      pickTopmost();
    }, { rootMargin: '-90px 0px -68% 0px', threshold: 0 });

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids.join('|')]);

  return active;
}
