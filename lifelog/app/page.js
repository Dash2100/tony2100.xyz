'use client';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import FeaturedPostsList from './components/FeaturedPostsList';
import TagsList from './components/TagsList';

const mockPosts = [
  {
    id: 1,
    title: "這是一段文章的標題文字",
    date: "2025 年 07 月 24 日",
    tags: ["競賽"],
    isPinned: true,
  },
  {
    id: 2,
    title: "這是一段文章的標題文字",
    date: "2025 年 07 月 24 日",
    tags: ["競賽"],
  },
  {
    id: 3,
    title: "這是一段文章的標題文字",
    date: "2025 年 07 月 24 日",
    tags: ["競賽"],
  },
  {
    id: 4,
    title: "這是一段文章的標題文字",
    date: "2025 年 07 月 24 日",
    tags: ["競賽"],
  },
];

const featuredPosts = [
  {
    title: "全國技能競賽 網頁技術職種參賽心得",
    date: "2025 年 07 月 24 日"
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, natus?",
    date: "2025 年 07 月 24 日"
  },
  {
    title: "全國技能競賽 網頁技術職種參賽心得",
    date: "2025 年 07 月 24 日"
  }
];

const tags = ["競賽", "北極熊", "程式開發", "北極"];

export default function Home() {
  return (
    <div className="bg-[#EDF5FA] flex min-h-screen">
      <Sidebar />
      
      <div className="w-full items-center p-16 max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="w-full h-[270px] px-10 py-20 rounded-[35px] mx-auto bg-[#DBECF8] text-[#4E5969] text-[40px] leading-[55px] font-bold flex items-center justify-center shadow-inner text-center">
          <h1 className="h-fit text-center">
            Tony2100&apos;s Life Log<br />
            Cover Image Placeholder
          </h1>
        </div>

        <div className="w-full flex gap-5">
          <div className="grid grid-cols-2 gap-5">
            {mockPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                date={post.date}
                tags={post.tags}
                isPinned={post.isPinned}
                onClick={() => console.log('Post clicked:', post.id)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-10">
            <FeaturedPostsList posts={featuredPosts} />
            <TagsList tags={tags} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
