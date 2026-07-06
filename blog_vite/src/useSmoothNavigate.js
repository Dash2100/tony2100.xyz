import { useNavigate } from 'react-router-dom';

/**
 * Smooth-scroll the current (outgoing) page to the top, THEN navigate.
 *
 * Because the scroll happens on the page you're leaving — which is exactly as
 * tall as wherever you scrolled — it always has the full distance to travel and
 * never clamps. No temporary height spacer is needed, which removes the sidebar
 * jitter and the "scroll out into empty space" overflow that the spacer caused.
 */
export default function useSmoothNavigate() {
  const navigate = useNavigate();

  return (to) => {
    if (window.scrollY <= 0) {
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
