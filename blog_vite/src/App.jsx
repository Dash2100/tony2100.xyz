import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import PostList from './pages/PostList.jsx';
import Notes from './pages/Notes.jsx';
import Article from './pages/Article.jsx';
import { peekScrollIntent, setScrollIntent } from './scrollIntent.js';

/**
 * Article-style smooth scroll on navigation (fuwari trick).
 *
 * Navigation happens IMMEDIATELY on click (the transition starts right away);
 * the incoming page then glides to the top while its content fades in. Before
 * scrolling, the document is made 300vh tall (#page-height-extend) so the
 * glide never clamps/jumps on a shorter page, and user wheel/touch input is
 * blocked while it runs. Everything is undone once it finishes.
 *
 * Only runs for 'smooth' navigations (sidenav switches are 'instant' and
 * handled by the incoming page on mount). Beyond ~1.5 viewport heights the
 * glide is downgraded to that same masked instant reset, so it never drags on.
 */
// Scroll positions per history entry (location.key), saved at the moment of
// leaving a page and re-applied on back/forward.
const savedPositions = new Map();

function NavigationScroll() {
  const location = useLocation();
  const { pathname } = location;
  const navType = useNavigationType();
  const first = useRef(true);
  const prevKey = useRef(location.key);

  useEffect(() => {
    const fromKey = prevKey.current;
    prevKey.current = location.key;

    if (first.current) {
      first.current = false;
      return;
    }

    // Remember where the page we're LEAVING was scrolled. This runs before
    // any scrolling below, so the value is untouched.
    savedPositions.set(fromKey, window.scrollY);

    // Back/forward (POP): restore the saved position ourselves. We wait until
    // the incoming page is mounted and tall enough (the exit animation and
    // content swap make the document briefly short — the reason the browser's
    // built-in restore fails here), then glide back to where the user was.
    if (navType === 'POP') {
      const saved = savedPositions.get(location.key) ?? 0;
      if (saved <= 0) return;
      let tries = 0;
      let raf = 0;
      const attempt = () => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll >= saved || tries >= 60) {
          window.scrollTo({
            top: Math.min(saved, Math.max(0, maxScroll)),
            behavior: 'smooth',
          });
          return;
        }
        tries++;
        raf = requestAnimationFrame(attempt);
      };
      raf = requestAnimationFrame(attempt);
      return () => cancelAnimationFrame(raf);
    }

    if (peekScrollIntent() !== 'smooth') return;

    if (window.scrollY > window.innerHeight * 1.5) {
      setScrollIntent('instant');
      return;
    }

    const html = document.documentElement;
    const block = (e) => e.preventDefault();

    html.classList.add('is-navigating');
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      html.classList.remove('is-navigating');
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      window.removeEventListener('scrollend', finish);
      clearTimeout(timer);
    };
    window.addEventListener('scrollend', finish);
    const timer = setTimeout(finish, 1200);

    return finish;
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/post/:slug" element={<Article />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen select-none">
        <NavigationScroll />
        <Navbar />
        {/* main column — each page renders its own footer inside the transition */}
        <div className="flex-1 flex flex-col min-w-0">
          <AnimatedRoutes />
          {/* Temporary spacer that gives the smooth scroll room to travel.
              It MUST live inside this flex container: the sticky sidebar can
              only stick within its parent, so if the extra height sat outside
              (as a sibling), the container would end mid-glide and the sidebar
              would get dragged off-screen whenever the incoming page is
              shorter than the current scroll position. */}
          <div id="page-height-extend" aria-hidden="true"></div>
        </div>
      </div>
    </MotionConfig>
  );
}
