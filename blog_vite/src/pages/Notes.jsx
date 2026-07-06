import Page from '../components/Page.jsx';
import MdContent from '../components/MdContent.jsx';
import { notes } from '../notes.js';

/**
 * Notes are quick, title-less jottings shown newest-first: just the content,
 * with the date tucked into the bottom-right corner of each card.
 */
export default function Notes() {
  return (
    <Page className="w-full px-4 py-6 sm:p-8 lg:px-12 lg:py-16 max-w-300 mx-auto flex flex-col gap-5 md:gap-8">
      {/* Hero banner — same visual anchor as the home/article covers */}
      <div className="relative w-full h-40 sm:h-44 md:h-56 rounded-3xl md:rounded-[35px] bg-[#DBECF8] shadow-inner overflow-hidden flex items-center justify-center mt-1 md:mt-0">
        {/* soft decorative glows */}
        <div aria-hidden="true" className="absolute -top-10 -left-10 w-44 h-44 md:w-60 md:h-60 rounded-full bg-white/50 blur-2xl" />
        <div aria-hidden="true" className="absolute -bottom-12 -right-8 w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#2D739A]/10 blur-2xl" />
        <div aria-hidden="true" className="absolute top-5 right-12 w-16 h-16 rounded-full bg-white/35 blur-xl" />

        <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4E5969] noto-font">筆記</h1>
          <h2 className="text-[15px] sm:text-base md:text-xl text-[#4E5969]/80 noto-font leading-relaxed">
            那些不夠長到寫成一篇文章，卻又想記下來的事
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {notes.length ? notes.map((n) => (
          <article key={n.slug}
            className="w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-3xl md:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col gap-3">
            <MdContent html={n.html} className="select-text note-content" />
            <div className="flex justify-end">
              <span className="flex items-center gap-1.5 bg-[#DBECF8] shadow-inner rounded-lg md:rounded-[10px] px-2.5 py-1 text-[13px] md:text-sm text-[#4E5969]/90 noto-font">
                <img src="/imgs/icon/date.svg" alt="" className="h-4 w-4" />
                {n.dateText}
              </span>
            </div>
          </article>
        )) : <p className="text-[#4E5969] noto-font text-center py-10">目前還沒有筆記。</p>}
      </div>
    </Page>
  );
}
