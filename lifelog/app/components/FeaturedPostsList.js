'use client';

import Image from 'next/image';

export default function FeaturedPostsList({ posts = [] }) {
  return (
    <div className="w-[300px] h-fit bg-[#f7fafd] border-[1px] border-[#4E5969]/20 shadow-inner rounded-[35px] p-6 flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-[#4E5969] text-[22px] font-semibold">熱門文章</h2>
        <button className="text-[#4E5969] text-[14px] font-semibold border-[1px] border-[#4E5969]/20 px-4 rounded-[10px] shadow-inner h-8 hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">
          更多
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 items-center">
          {posts.map((post, index) => (
            <div
              key={index}
              className="flex flex-col border-[1px] border-[#4E5969]/20 w-full px-4 py-[10px] rounded-[15px] shadow-inner gap-[2px] select-none cursor-pointer hover:bg-[#DBECF8] transition-all duration-200 ease-in-out"
            >
              <p className="text-[#4E5969] text-[15px] truncate">{post.title}</p>
              <div className="flex gap-1">
                <Image 
                  src="/imgs/icon/date.svg" 
                  alt="Calendar Icon" 
                  width={16}
                  height={16}
                  className="my-auto"
                />
                <p className="text-[#4E5969] text-[13px]">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}