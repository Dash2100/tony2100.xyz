import Page from '../components/Page.jsx';
import { notes } from '../notes.js';

/** Notes are quick, tag-less jottings shown newest-first. */
export default function Notes() {
  return (
    <Page className="w-full p-4 md:p-8 lg:p-16 max-w-225 mx-auto flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-3 text-center mt-4 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4E5969] noto-font">筆記</h1>
        <h2 className="text-base md:text-2xl text-[#4E5969]/80 noto-font">那些不夠長到寫成一篇文章，卻又想記下來的事</h2>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {notes.length ? notes.map((n) => (
          <article key={n.slug}
            className="w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[#4E5969] text-lg md:text-2xl font-semibold noto-font leading-snug">{n.title}</h2>
              <div className="flex items-center gap-1.5 text-[#4E5969]/75 text-[13px] sm:text-sm noto-font">
                <img src="/imgs/icon/date.svg" alt="Calendar Icon" className="h-4 w-4" />
                <span>{n.dateText}</span>
              </div>
            </div>
            <div className="md-content text-[15px] md:text-base select-text"
              dangerouslySetInnerHTML={{ __html: n.html }} />
          </article>
        )) : <p className="text-[#4E5969] noto-font text-center py-10">目前還沒有筆記。</p>}
      </div>
    </Page>
  );
}
