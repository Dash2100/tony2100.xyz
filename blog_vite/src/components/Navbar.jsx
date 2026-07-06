import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { setScrollIntent } from '../scrollIntent.js';

const desktop = ({ isActive }) =>
  `nav-link flex items-center justify-center p-2 rounded-full transition-all ease-in-out duration-200 ${isActive ? 'nav-active' : ''}`;

const mobile = ({ isActive }) =>
  `nav-link flex flex-col items-center justify-center p-3 rounded-full transition-all ease-in-out duration-200 ${isActive ? 'nav-active' : ''}`;

const SITE_URL = 'https://tony2100.xyz';

// Section switches from the side nav play the same animation every time,
// independent of scroll position (instant scroll reset, masked by the fade).
const instant = () => setScrollIntent('instant');

/** Light / dark toggle — .dark class on <html>, persisted (default: light). */
function ThemeToggle({ className, iconClass }) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('blog-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button type="button" onClick={flip} className={className}
      aria-label={dark ? '切換為明亮模式' : '切換為深色模式'} title="切換主題">
      {dark ? (
        /* sun */
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        /* moon */
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  return (
    <>
      {/* side nav (desktop) */}
      <div className="h-dvh w-17.5 px-2 py-10 bg-[var(--bg)] shadow-nav flex-col items-center sticky top-0 left-0 hidden lg:flex z-50">
        <div className="flex items-center justify-center">
          <img src="/imgs/profile.png" alt="Profile Picture" className="h-12 w-12 rounded-full" />
        </div>
        <div className="flex flex-col gap-10 my-16">
          <NavLink to="/" end className={desktop} onClick={instant}>
            <img src="/imgs/icon/home.svg" alt="Home" className="h-7 w-7" />
          </NavLink>
          <NavLink to="/posts" className={desktop} onClick={instant}>
            <img src="/imgs/icon/blog.svg" alt="Blog" className="h-7 w-7" />
          </NavLink>
          <NavLink to="/notes" className={desktop} onClick={instant}>
            <img src="/imgs/icon/note.svg" alt="Note" className="h-7 w-7" />
          </NavLink>
        </div>
        <div className="mt-auto flex flex-col items-center gap-6">
          <ThemeToggle
            className="nav-link flex items-center justify-center p-2 rounded-full transition-all ease-in-out duration-200 text-[var(--ink)] cursor-pointer"
            iconClass="h-6.5 w-6.5" />
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" aria-label="個人網站"
            className="nav-link flex items-center justify-center p-2 rounded-full transition-all ease-in-out duration-200">
            <img src="/imgs/icon/world.svg" alt="Website" className="h-7 w-7" />
          </a>
        </div>
      </div>

      {/* mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg)] shadow-nav pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center py-3 px-4">
          <NavLink to="/" end className={mobile} onClick={instant}>
            <img src="/imgs/icon/home.svg" alt="Home" className="h-6 w-6" />
          </NavLink>
          <NavLink to="/posts" className={mobile} onClick={instant}>
            <img src="/imgs/icon/blog.svg" alt="Blog" className="h-6 w-6" />
          </NavLink>
          <NavLink to="/notes" className={mobile} onClick={instant}>
            <img src="/imgs/icon/note.svg" alt="Note" className="h-6 w-6" />
          </NavLink>
          <ThemeToggle
            className="nav-link flex flex-col items-center justify-center p-3 rounded-full transition-all ease-in-out duration-200 text-[var(--ink)] cursor-pointer"
            iconClass="h-6 w-6" />
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" aria-label="個人網站"
            className="nav-link flex flex-col items-center justify-center p-3 rounded-full transition-all ease-in-out duration-200">
            <img src="/imgs/icon/world.svg" alt="Website" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </>
  );
}
