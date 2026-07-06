import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
 * Only runs for 'smooth' navigations (sidenav switches are 'instant' and handled
 * by the incoming page on mount). Before scrolling, the document is made 300vh
 * tall (#page-height-extend) so the smooth scroll never clamps/jumps on a
 * shorter page. While it runs we also block user wheel/touch input, so the user
 * can't scroll down into the temporary empty space. Everything is undone once
 * the scroll finishes.
 */
function NavigationScroll() {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (peekScrollIntent() !== 'smooth') return;

    // Long distances make the native smooth scroll drag on (very noticeable on
    // mobile when clicking the featured/tag widgets at the bottom of a long
    // page). Past ~1.5 viewports, downgrade to the sidebar-style instant
    // reset: the incoming page consumes the intent and snaps to the top while
    // its content is still invisible, so only the fade is visible.
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
        </div>
      </div>
      {/* temporary spacer that gives the smooth scroll room to travel */}
      <div id="page-height-extend" aria-hidden="true"></div>
    </MotionConfig>
  );
}
