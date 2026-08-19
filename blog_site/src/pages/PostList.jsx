import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import PostCard from '../components/PostCard.jsx';
import useSeo from '../seo.js';
import { posts, getAllTags, filterByTag } from '../posts.js';

// Per-card entrance: same fade-in-up language as `.page-onload` (2rem rise,
// ease-out), but each card is staggered individually so the list "cascades".
// Delay is capped so long lists don't take forever to settle.
const CARD_STEP = 0.06;
const CARD_CAP = 8;

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: ({ i, base }) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut', delay: base + Math.min(i, CARD_CAP) * CARD_STEP },
  }),
};

const listVariants = {
  hidden: {},
  show: {},
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeOut' } },
};

export default function PostList() {
  const [params, setParams] = useSearchParams();
  const active = params.get('tag') || 'all';
  const tags = getAllTags();
  const filtered = filterByTag(active);
  useSeo({
    title: active === 'all' ? '文章列表' : `${active} 相關文章`,
    description: 'Tony2100 的所有文章：技術筆記、生活紀錄與隨筆。',
    path: '/posts',
    keywords: tags.map((t) => t.tag),
  });

  // First mount rides the page entrance (starts alongside the title/pills
  // cascade); tag switches respond immediately.
  const firstMount = useRef(true);
  useEffect(() => {
    firstMount.current = false;
  }, []);
  const base = firstMount.current ? 0.1 : 0.02;

  const select = (tag) => setParams(tag === 'all' ? {} : { tag });

  const Pill = ({ label, tag, count }) => {
    const isActive = tag === active;
    return (
      <button type="button" onClick={() => select(tag)}
        className={`px-3 md:px-4 py-1 sm:py-1.5 noto-font text-sm sm:text-[15px] md:text-base border rounded-[10px] shadow-inner transition-all duration-200 ease-in-out cursor-pointer origin-center
          ${isActive
            ? 'bg-[var(--accent)] text-[var(--accent-ink)] border-[var(--accent)] scale-105'
            : 'bg-[var(--card)] text-[var(--ink)] border-[var(--ink)]/20 hover:bg-[var(--card-2)]'}`}>
        {label}{count != null && <span className="opacity-70"> {count}</span>}
      </button>
    );
  };

  return (
    <Page footerKey={active} className="w-full px-4 py-6 sm:p-8 lg:px-12 lg:py-16 max-w-300 mx-auto flex flex-col gap-5 md:gap-8">
      {/* Hero banner — same visual anchor as the home/article covers */}
      <div className="relative w-full h-40 sm:h-44 md:h-56 rounded-3xl md:rounded-[35px] bg-[var(--card-2)] shadow-inner overflow-hidden flex items-center justify-center mt-1 md:mt-0">
        {/* soft decorative glows */}
        <div aria-hidden="true" className="absolute -top-10 -left-10 w-44 h-44 md:w-60 md:h-60 rounded-full bg-white/50 blur-2xl" />
        <div aria-hidden="true" className="absolute -bottom-12 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-full bg-[var(--accent)]/10 blur-2xl" />
        <div aria-hidden="true" className="absolute top-5 right-12 w-16 h-16 rounded-full bg-white/35 blur-xl" />

        <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)] noto-font">文章列表</h1>
          <h2 className="text-[15px] sm:text-base md:text-xl text-[var(--ink)]/80 noto-font leading-relaxed">
            我覺得這件事撇除不好玩的部分，其實都蠻好玩的
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        <Pill label="全部" tag="all" count={posts.length} />
        {tags.map(({ tag, count }) => <Pill key={tag} label={tag} tag={tag} count={count} />)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          variants={listVariants} initial="hidden" animate="show" exit="exit"
          className="no-onload flex flex-col gap-4 sm:gap-5">
          {filtered.length
            ? filtered.map((p, i) => (
              <motion.div key={p.slug} variants={cardVariants} custom={{ i, base }}>
                <PostCard post={p} />
              </motion.div>
            ))
            : (
              <motion.p variants={cardVariants} custom={{ i: 0, base }}
                className="text-[var(--ink)] noto-font text-center py-10">
                這個標籤底下還沒有文章。
              </motion.p>
            )}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
