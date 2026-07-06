import { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer.jsx';
import { takeScrollIntent } from '../scrollIntent.js';

// fuwari-style page transition: the whole page (content + footer) fades/slides
// out on leave; the entering page's content blocks fade-in-up in a stagger
// (`.page-onload`). The footer lives INSIDE the transition so it fades with the
// page, while keeping its own constant-width container.
const variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

export default function Page({ children, className = '' }) {
  // Sidenav navigations are 'instant': reset scroll before paint, while the
  // incoming content is still invisible (opacity 0 during its onload). This
  // keeps the section-switch animation identical regardless of scroll position.
  // 'smooth' navigations are scrolled by the App-level handler instead.
  useLayoutEffect(() => {
    if (takeScrollIntent() === 'instant') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* content area kept ≥101vh tall so the footer stays off-screen until the
          user scrolls down */}
      <div className={`page-onload min-h-[101vh] ${className}`}>
        {children}
      </div>
      <div className="onload-footer">
        <Footer />
      </div>
    </motion.main>
  );
}
