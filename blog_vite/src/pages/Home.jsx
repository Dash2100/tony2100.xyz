import { Link } from 'react-router-dom';
import Page from '../components/Page.jsx';
import PostCard from '../components/PostCard.jsx';
import useTypewriter from '../hooks/useTypewriter.js';
import { posts, getFeatured, getAllTags } from '../posts.js';

const TYPE_TEXTS = [
  '每個成功的男人背後，都有一條脊椎',
  '如果你願意多花一點時間了解我，你會發現你多花了一點時間',
  '我覺得這件事撇除不好玩的部分，其實都蠻好玩的',
  '注意!!!!!!!!!!!!!     感謝你的注意。',
  '為什麼警察不直接去監獄裡抓人?',
  '在成功路上，一定有紅綠燈',
  '在哪裡跌倒，就在哪裡睡覺',
  '每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果',
  '你有什麼不開心的事? 講出來讓大家開心一下嘛',
  '如果你現在在看手機，代表你手機在你手上',
  '如果覺得冷，就蹲在牆角，因為那裡有90度',
  '研表究明，手機長期不充電，就會沒電',
  '只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶',
  '經證實，人在清醒的時候通常都沒在睡覺',
  '什麼是大數據，我只聽過陳樹據',
  '我能預測未來，比如你看完這句話後會看下一句話',
];

export default function Home() {
  const typed = useTypewriter(TYPE_TEXTS);
  const featured = getFeatured(3);
  const tags = getAllTags();

  return (
    <Page className="w-full items-center px-5 py-6 sm:p-8 lg:p-16 max-w-325 mx-auto flex flex-col gap-5 md:gap-8">
      {/* Cover */}
      <div className="relative w-full h-40 sm:h-52 md:h-67.5 rounded-3xl md:rounded-[35px] mx-auto bg-[#DBECF8] text-[#4E5969] font-bold shadow-inner overflow-hidden flex items-center justify-center mt-1 md:mt-0">
        <img src="/imgs/home-cover.png" alt="Home Cover"
          className="absolute w-full h-full object-cover z-10" />
        <span className="z-50 flex-col gap-1.5 md:gap-4 absolute flex w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-center px-4">Tony2100's Life Log</h1>
          <div className="relative w-full min-h-6 md:min-h-9 lg:min-h-12">
            <h1 className="absolute inset-0 text-sm sm:text-base md:text-2xl lg:text-3xl text-center px-4 flex items-start justify-center">
              {typed}
            </h1>
          </div>
        </span>
      </div>

      {/* Posts + sidebar */}
      <div className="w-full flex xl:flex-row flex-col gap-5 md:gap-6 relative items-start">
        <div className="xl:flex-1 min-w-0 w-full grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-4 sm:gap-5">
          {posts.map((p) => <PostCard key={p.slug} post={p} />)}
        </div>

        <div className="flex flex-col gap-6 sticky top-4 self-start w-full xl:w-75 z-20 h-fit shrink-0">
          {/* Featured */}
          <div className="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-3xl md:rounded-[35px] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">熱門文章</h2>
              <Link to="/posts" className="text-[#4E5969] text-xs md:text-sm font-semibold noto-font border border-[#4E5969]/20 px-3 md:px-4 rounded-[10px] shadow-inner h-7 md:h-8 flex items-center hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">更多</Link>
            </div>
            <div className="flex flex-col gap-4">
              {featured.map((p) => (
                <Link key={p.slug} to={`/post/${p.slug}`}
                  className="flex flex-col border border-[#4E5969]/20 w-full px-4 py-2.5 rounded-[15px] shadow-inner gap-0.5 cursor-pointer hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">
                  <p className="text-[#4E5969] text-[15px] noto-font truncate">{p.title}</p>
                  <div className="flex gap-1">
                    <img src="/imgs/icon/date.svg" alt="Calendar Icon" className="h-4 w-4 my-auto" />
                    <p className="text-[#4E5969] text-[13px] noto-font">{p.dateText}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tag cloud */}
          <div className="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-3xl md:rounded-[35px] p-5 sm:p-6 flex flex-col gap-4">
            <h2 className="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">文章標籤</h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {tags.map(({ tag, count }) => (
                <Link key={tag} to={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="text-[#4E5969] text-sm md:text-base px-3 md:px-4 py-1 noto-font border border-[#4E5969]/20 rounded-[10px] shadow-inner w-fit hover:bg-[#DBECF8] transition-all duration-200 ease-in-out cursor-pointer">
                  {tag} <span className="opacity-60">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
