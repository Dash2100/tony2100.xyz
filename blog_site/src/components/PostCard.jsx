import { Link } from 'react-router-dom';
import { TagItem, TagIcon } from './Tags.jsx';

/**
 * Post card used on the home grid and the post list. It's a router <Link>, so
 * clicking it transitions to the article in place (no full page reload).
 */
export default function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      data-testid="post-card"
      className="w-full h-full xl:h-auto bg-[var(--card)] border border-[var(--ink)]/20 shadow-inner rounded-3xl md:rounded-[35px] gap-3 sm:gap-4 p-3.5 sm:p-5 md:p-6 xl:py-8 xl:px-9 flex flex-col xl:flex-row justify-between group cursor-pointer hover:bg-[var(--card-hover)] transition-colors duration-300"
    >
      <div className="w-full xl:w-70 aspect-video bg-[var(--card-2)] rounded-[20px] shadow-inner overflow-hidden shrink-0 order-1 xl:order-2">
        <img src={post.cover} alt={post.title} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out lg:group-hover:scale-[1.02]" />
      </div>
      <div className="flex flex-col justify-between flex-1 gap-2 sm:gap-3 mt-1 xl:mt-0 order-2 xl:order-1">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h2 className="text-[var(--ink)] text-lg md:text-xl xl:text-[22px] font-medium noto-font leading-snug">
            {post.title}
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 mt-0.5 sm:mt-1 mb-1 sm:mb-2 items-center">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <img src="/imgs/icon/date.svg" alt="Calendar Icon" className="h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-[var(--ink)] text-sm xl:text-[15px] noto-font font-medium">{post.dateText}</p>
            </div>
            <div className="w-0.5 h-3.5 xl:h-4 bg-[var(--ink)] hidden lg:block"></div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <img src="/imgs/icon/words.svg" alt="Word Count Icon" className="h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-[var(--ink)] text-sm xl:text-[15px] noto-font font-medium">{post.wordsText}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 sm:gap-2 w-full flex-wrap mt-auto pt-1.5 sm:pt-2 xl:pt-0">
          {post.pinned && <TagIcon icon="/imgs/icon/pin.svg">置頂</TagIcon>}
          {post.tags.map((t) => <TagItem key={t}>{t}</TagItem>)}
        </div>
      </div>
    </Link>
  );
}
