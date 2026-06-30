import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page.jsx';
import PostCard from '../components/PostCard.jsx';
import { posts, getAllTags, filterByTag } from '../posts.js';

export default function PostList() {
  const [params, setParams] = useSearchParams();
  const active = params.get('tag') || 'all';
  const tags = getAllTags();
  const filtered = filterByTag(active);

  const select = (tag) => setParams(tag === 'all' ? {} : { tag });

  const Pill = ({ label, tag, count }) => {
    const isActive = tag === active;
    return (
      <button type="button" onClick={() => select(tag)}
        className={`px-3 md:px-4 py-1.5 noto-font text-sm md:text-base border rounded-[10px] shadow-inner transition-all duration-200 ease-in-out cursor-pointer origin-center
          ${isActive
            ? 'bg-[#2D739A] text-white border-[#2D739A] scale-105'
            : 'bg-[#f7fafd] text-[#4E5969] border-[#4E5969]/20 hover:bg-[#DBECF8]'}`}>
        {label}{count != null && <span className="opacity-70"> {count}</span>}
      </button>
    );
  };

  return (
    <Page className="w-full p-4 md:p-8 lg:p-16 max-w-300 mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-3 text-center mt-4 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4E5969] noto-font">文章列表</h1>
        <h2 className="text-base md:text-2xl text-[#4E5969]/80 noto-font">我覺得這件事撇除不好玩的部分，其實都蠻好玩的</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        <Pill label="全部" tag="all" count={posts.length} />
        {tags.map(({ tag, count }) => <Pill key={tag} label={tag} tag={tag} count={count} />)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.2, 0.85, 0.15, 1] }}
          className="flex flex-col gap-4 sm:gap-5">
          {filtered.length
            ? filtered.map((p) => <PostCard key={p.slug} post={p} />)
            : <p className="text-[#4E5969] noto-font text-center py-10">這個標籤底下還沒有文章。</p>}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
