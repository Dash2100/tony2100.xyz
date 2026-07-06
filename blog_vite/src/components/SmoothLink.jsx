import { Link } from 'react-router-dom';
import useSmoothNavigate from '../useSmoothNavigate.js';

/**
 * A router <Link> that smooth-scrolls to the top before navigating. Falls back
 * to normal Link behavior for modified clicks (open in new tab, etc.).
 */
export default function SmoothLink({ to, onClick, children, ...props }) {
  const smoothNav = useSmoothNavigate();

  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    smoothNav(to);
  };

  return (
    <Link to={to} onClick={handle} {...props}>
      {children}
    </Link>
  );
}
