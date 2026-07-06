import { useParams, useNavigate, Link } from 'react-router-dom';
import Page from '../components/Page.jsx';
import useScrollSpy from '../hooks/useScrollSpy.js';
import { getPostBySlug } from '../posts.js';

export default function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const ids = post ? post.toc.map((t) => t.id) : [];
  const activeId = useScrollSpy(ids);

  if (!post) {
    return (
      <Page className="w-full p-4 md:p-8 lg:p-16 max-w-225 mx-auto flex flex-col items-center gap-6 text-center py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4E5969] noto-font">找不到這篇文章</h1>
        <Link to="/posts" className="text-[#2D739A] underline noto-font">回到文章列表</Link>
      </Page>
    );
  }

  const onTocClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page className="w-full items-center px-5 py-6 sm:p-8 lg:p-16 max-w-325 mx-auto flex flex-col gap-5 md:gap-8">
      {/* Cover */}
      <div className="relative w-full h-44 sm:h-52 md:h-67.5 rounded-3xl md:rounded-[35px] bg-[#DBECF8] shadow-inner overflow-hidden flex items-center justify-center mt-1 md:mt-0">
        <img src={post.cover} alt={post.title} className="absolute w-full h-full object-cover z-10 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-[#DBECF8]/40 z-20" />
        <button onClick={() => navigate(-1)}
          className="absolute flex gap-1 md:gap-3 top-3 left-3 md:top-6 md:left-6 z-50 rounded-lg md:rounded-[10px] bg-white/80 shadow-inner px-2.5 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-white transition-all duration-300 ease-in-out font-medium text-[#4E5969] border border-[#4E5969]/20 backdrop-blur-xl">
          <img src="/imgs/icon/back.svg" alt="Back" className="h-4 md:h-6 my-auto" />
          <p className="my-auto text-xs md:text-base">返回</p>
        </button>
        <span className="z-40 flex flex-col gap-1.5 md:gap-3 absolute w-full px-5 select-text">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-center font-bold text-[#4E5969] leading-snug">{post.title}</h1>
          {post.subtitle && (
            <h2 className="text-xs sm:text-lg md:text-2xl lg:text-3xl text-center text-[#4E5969]/80">{post.subtitle}</h2>
          )}
        </span>
      </div>

      {/* Body + TOC */}
      <div className="w-full flex xl:flex-row flex-col gap-5 md:gap-6 relative items-start">
        <article className="xl:flex-1 min-w-0 w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-3xl md:rounded-[35px] p-5 sm:p-6 md:p-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[#4E5969]/75 text-[13px] sm:text-sm noto-font mb-5 pb-5 md:mb-6 md:pb-6 border-b border-[#4E5969]/12">
            <span className="flex items-center gap-1"><img src="/imgs/icon/date.svg" className="h-4 w-4" alt="" />{post.dateText}</span>
            <span className="flex items-center gap-1"><img src="/imgs/icon/words.svg" className="h-4 w-4" alt="" />{post.wordsText}</span>
            <span>· 約 {post.readingMinutes} 分鐘</span>
          </div>
          <div className="md-content select-text" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        {post.toc.length > 0 && (
          <aside className="hidden xl:flex flex-col gap-4 sticky top-4 self-start w-75 z-20 h-fit shrink-0 bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6">
            <h2 className="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">文章目錄</h2>
            <nav className="flex flex-col gap-2.5">
              {post.toc.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <a key={item.id} href={`#${item.id}`} onClick={(e) => onTocClick(e, item.id)}
                    className={`toc-link flex items-center gap-1 origin-left transition-all duration-300 ease-out
                      ${item.level === 3 ? 'ml-5 text-[15px]' : 'text-lg font-semibold'}
                      ${isActive ? 'toc-active text-[#2D739A] font-bold scale-105' : 'text-[#4E5969] hover:text-[#2D739A]'}`}>
                    <img src="/imgs/icon/list-arrow.svg" alt="" className="toc-arrow w-4 shrink-0" />
                    <span>{item.text}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
        )}
      </div>
    </Page>
  );
}
