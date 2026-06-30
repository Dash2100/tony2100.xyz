import { useEffect } from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * Shared page wrapper: applies the smooth fade/slide transition used for every
 * route change and resets scroll position on mount.
 */
export default function Page({ children, className = '' }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.24, ease: [0.2, 0.85, 0.15, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  );
}
