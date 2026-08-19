import { useState } from 'react';
import ListScreen from './ListScreen.jsx';
import EditorScreen from './EditorScreen.jsx';

/** Light / dark toggle — class on <html>, persisted, no-flash (see index.html). */
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('editor-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button type="button" className="btn btn-icon" onClick={flip}
      aria-label={dark ? '切換為淺色模式' : '切換為深色模式'} title="切換主題">
      {dark ? (
        /* sun */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        /* moon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      )}
    </button>
  );
}

export default function App() {
  const [route, setRoute] = useState({ name: 'list', type: 'posts' });

  if (route.name === 'edit') {
    return (
      <EditorScreen
        type={route.type}
        slug={route.slug}
        onBack={() => setRoute({ name: 'list', type: route.type })}
      />
    );
  }
  return (
    <ListScreen
      initialType={route.type}
      onOpen={(type, slug) => setRoute({ name: 'edit', type, slug })}
    />
  );
}
