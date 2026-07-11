import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import MdContent from '../components/MdContent.jsx';
import useScrollSpy from '../hooks/useScrollSpy.js';
import useSeo from '../seo.js';
import { lockScroll, unlockScroll } from '../scrollLock.js';
import { getPostBySlug } from '../posts.js';

/** Shared TOC link list (desktop sidebar + mobile sheet). */
function TocLinks({ toc, activeId, onClick }) {
  return toc.map((item) => {
    const isActive = item.id === activeId;
    return (
      <a key={item.id} href={`#${item.id}`} onClick={(e) => onClick(e, item.id)}
        className={`toc-link flex items-center gap-1 origin-left transition-all duration-300 ease-out
          ${item.level === 3 ? 'ml-5 text-[15px]' : 'text-lg font-semibold'}
          ${isActive ? 'toc-active text-[var(--accent)] font-bold scale-105' : 'text-[var(--ink)] hover:text-[var(--accent)]'}`}>
        <img src="/imgs/icon/list-arrow.svg" alt="" className="toc-arrow w-4 shrink-0" />
        <span>{item.text}</span>
      </a>
    );
  });
}

export default function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const ids = post ? post.toc.map((t) => t.id) : [];
  const [activeId, activate] = useScrollSpy(ids);
  const [tocOpen, setTocOpen] = useState(false);
  useSeo(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          path: `/post/${post.slug}`,
          keywords: post.tags,
          image: post.cover,
          type: 'article',
        }
      : { title: '找不到這篇文章', path: '/posts' }
  );

  // Idempotent lock ownership for the mobile sheet: onTocClick unlocks
  // immediately (the page must scroll NOW), and the effect cleanup that runs
  // later becomes a no-op instead of double-releasing.
  const sheetLock = useRef(false);
  const lockSheet = () => {
    if (!sheetLock.current) {
      sheetLock.current = true;
      lockScroll();
    }
  };
  const unlockSheet = () => {
    if (sheetLock.current) {
      sheetLock.current = false;
      unlockScroll();
    }
  };

  // Mobile sheet: lock page scroll while open, close on Escape.
  useEffect(() => {
    if (!tocOpen) return;
    lockSheet();
    const onKey = (e) => e.key === 'Escape' && setTocOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      unlockSheet();
      window.removeEventListener('keydown', onKey);
    };
  }, [tocOpen]);

  if (!post) {
    return (
      <Page className="w-full p-4 md:p-8 lg:p-16 max-w-225 mx-auto flex flex-col items-center gap-6 text-center py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--ink)] noto-font">找不到這篇文章</h1>
        <Link to="/posts" className="text-[var(--accent)] underline noto-font">回到文章列表</Link>
      </Page>
    );
  }

  const onTocClick = (e, id) => {
    e.preventDefault();
    setTocOpen(false);
    unlockSheet(); // unlock immediately so the scroll below works
    activate(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page className="w-full items-center px-4 py-6 sm:p-8 lg:p-16 max-w-325 mx-auto flex flex-col gap-5 md:gap-8">
      {/* Decorative header (blurred cover + title) */}
      <div className="relative w-full h-52 md:h-67.5 rounded-3xl md:rounded-[35px] bg-[var(--card-2)] shadow-inner overflow-hidden flex justify-center md:items-center mt-1 md:mt-0">
        <img src={post.cover} alt="" aria-hidden="true" className="absolute w-full h-full object-cover z-10 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-[var(--card-2)]/40 z-20" />
        <button type="button" onClick={() => navigate(-1)}
          className="absolute flex gap-1.5 md:gap-3 top-3 left-3 md:top-6 md:left-6 z-50 rounded-[10px] bg-[var(--card)]/85 shadow-inner px-3.5 py-2 md:px-4 md:py-2 cursor-pointer hover:bg-[var(--card)] transition-all duration-300 ease-in-out font-medium text-[var(--ink)] border border-[var(--ink)]/20 backdrop-blur-xl">
          <img src="/imgs/icon/back.svg" alt="Back" className="h-4 md:h-6 my-auto" />
          <p className="my-auto text-sm md:text-base">返回</p>
        </button>
        {/* Mobile: the block's TOP edge is pinned at "where a one-line title
            sits when centered" (container middle minus half a one-line block),
            so a single-line title looks perfectly centered while wrapped lines
            can only grow DOWNWARD — the top never climbs into the back button.
            md+: normal vertical centering as before. */}
        <span className="z-40 flex flex-col gap-1.5 md:gap-3 w-full px-6 select-text absolute left-0 top-1/2 -mt-8 md:static md:top-auto md:mt-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-[var(--ink)] leading-snug">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl text-center text-[var(--ink)]/80">{post.subtitle}</h2>
          )}
        </span>
      </div>

      {/* Body + TOC */}
      <div className="w-full flex xl:flex-row flex-col gap-5 md:gap-6 relative items-start">
        <article className="xl:flex-1 min-w-0 w-full bg-[var(--card)] border border-[var(--ink)]/20 shadow-inner rounded-3xl md:rounded-[35px] p-4 sm:p-6 md:p-10">
          {/* Actual 16:9 cover image */}
          <div className="w-full aspect-video bg-[var(--card-2)] rounded-[20px] md:rounded-3xl shadow-inner overflow-hidden mb-5 md:mb-6">
            <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[var(--ink)]/75 text-sm noto-font mb-5 pb-5 md:mb-6 md:pb-6 border-b border-[var(--ink)]/12">
            <span className="flex items-center gap-1"><img src="/imgs/icon/date.svg" className="h-4 w-4" alt="" />{post.dateText}</span>
            <span className="flex items-center gap-1"><img src="/imgs/icon/words.svg" className="h-4 w-4" alt="" />{post.wordsText}</span>
            <span>· 約 {post.readingMinutes} 分鐘</span>
          </div>
          <MdContent html={post.html} className="select-text" />
        </article>

        {/* Desktop TOC */}
        {post.toc.length > 0 && (
          <aside className="hidden xl:flex flex-col gap-4 sticky top-4 self-start w-75 z-20 h-fit shrink-0 bg-[var(--card)] border border-[var(--ink)]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6">
            <h2 className="text-[var(--ink)] text-lg md:text-[22px] font-semibold noto-font">文章目錄</h2>
            {/* Never scrolls internally — the block always shows every entry. */}
            <nav className="flex flex-col gap-2.5">
              <TocLinks toc={post.toc} activeId={activeId} onClick={onTocClick} />
            </nav>
          </aside>
        )}
      </div>

      {/* Mobile TOC: floating toggle + bottom sheet (portal escapes the page
          transition's transform so `fixed` stays viewport-relative) */}
      {post.toc.length > 0 && createPortal(
        <>
          <motion.button type="button" aria-label="開啟文章目錄" onClick={() => setTocOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
            className="xl:hidden fixed z-50 right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:right-6 lg:bottom-6 h-12 w-12 rounded-full bg-[var(--card)] border border-[var(--ink)]/20 shadow-nav flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-[var(--ink)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </motion.button>

          <AnimatePresence>
            {tocOpen && (
              <>
                <motion.div key="toc-backdrop" onClick={() => setTocOpen(false)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="xl:hidden fixed inset-0 z-[60] bg-[var(--scrim)] backdrop-blur-[2px]" />
                <motion.div key="toc-sheet" role="dialog" aria-modal="true" aria-label="文章目錄"
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ duration: 0.3, ease: [0.2, 0.85, 0.15, 1] }}
                  className="xl:hidden fixed bottom-0 inset-x-0 z-[70] bg-[var(--card)] border-t border-[var(--ink)]/20 rounded-t-3xl shadow-nav flex flex-col gap-3 p-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <div className="h-1 w-10 rounded-full bg-[var(--ink)]/20 mx-auto shrink-0" />
                  <h2 className="text-[var(--ink)] text-lg font-semibold noto-font">文章目錄</h2>
                  {/* Never scrolls internally — the sheet grows to fit every entry. */}
                  <nav className="flex flex-col gap-2.5">
                    <TocLinks toc={post.toc} activeId={activeId} onClick={onTocClick} />
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </Page>
  );
}
