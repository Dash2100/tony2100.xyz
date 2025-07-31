'use client';

import Image from 'next/image';

export default function PostCard({ 
  title, 
  date, 
  tags = [], 
  coverImage = "/imgs/post-placeholder.png",
  isPinned = false,
  onClick 
}) {
  return (
    <div
      className="w-[365px] h-[345px] bg-[#f7fafd] border-[1px] border-[#4E5969]/20 shadow-inner rounded-[35px] flex flex-col gap-2 items-center p-8 select-none cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-full h-[200px] bg-[#DBECF8] rounded-[20px] mb-2 shadow-inner overflow-hidden">
        <Image 
          src={coverImage}
          alt="Post Cover Image"
          width={365}
          height={200}
          className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="flex gap-2 w-full">
        {isPinned && (
          <span className="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-[10px] text-[15px] shadow-inner flex items-center">
            <Image 
              src="/imgs/icon/pin.svg" 
              alt="Pin Icon" 
              width={16}
              height={16}
              className="inline mr-1"
            />
            置頂
          </span>
        )}
        {tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-[10px] text-[15px] shadow-inner"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-[#4E5969] text-[22px] font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Image 
            src="/imgs/icon/date.svg" 
            alt="Calendar Icon" 
            width={20}
            height={20}
            className="my-auto"
          />
          <p className="text-[#4E5969] text-[14px] font-semibold my-auto">{date}</p>
        </div>
      </div>
    </div>
  );
}