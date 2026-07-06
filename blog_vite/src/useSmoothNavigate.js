import { useNavigate } from 'react-router-dom';

/**
 * Article-style navigation: smooth-scroll the current (outgoing) page to the
 * top, THEN navigate. The incoming page always mounts at the top on its own
 * (Page.jsx), so this is purely a visual flourish for short distances.
 *
 * Beyond ~1.5 viewport heights the flourish is skipped: watching the page fly
 * by for seconds (with a giant scrollbar) feels like lag, while an instant
 * switch is fully masked by the page fade anyway.
 */
export default function useSmoothNavigate() {
  const navigate = useNavigate();

  return (to) => {
    const y = window.scrollY;
    if (y <= 0 || y > window.innerHeight * 1.5) {
      navigate(to);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', go);
      clearTimeout(timer);
      navigate(to);
    };
    window.addEventListener('scrollend', go);
    const timer = setTimeout(go, 700);
  };
}
