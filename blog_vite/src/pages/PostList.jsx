import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import PostCard from '../components/PostCard.jsx';
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
        className={`px-3 md:px-4 py-1 sm:py-1.5 noto-font text-[13px] sm:text-sm md:text-base border rounded-[10px] shadow-inner transition-all duration-200 ease-in-out cursor-pointer origin-center
          ${isActive
            ? 'bg-[#2D739A] text-white border-[#2D739A] scale-105'
            : 'bg-[#f7fafd] text-[#4E5969] border-[#4E5969]/20 hover:bg-[#DBECF8]'}`}>
        {label}{count != null && <span className="opacity-70"> {count}</span>}
      </button>
    );
  };

  return (
    <Page className="w-full px-5 py-6 sm:p-8 lg:p-16 max-w-300 mx-auto flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-2 sm:gap-3 text-center mt-1 md:mt-0">
        <h1 className="text-2xl md:text-4xl font-bold text-[#4E5969] noto-font">文章列表</h1>
        <h2 className="text-sm md:text-2xl text-[#4E5969]/80 noto-font px-2">我覺得這件事撇除不好玩的部分，其實都蠻好玩的</h2>
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
                className="text-[#4E5969] noto-font text-center py-10">
                這個標籤底下還沒有文章。
              </motion.p>
            )}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
