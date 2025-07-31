'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="h-screen w-[70px] px-2 py-10 bg-[#EDF5FA] shadow-nav flex flex-col items-center sticky top-0 left-0">
      <div className="flex items-center justify-center">
        <Image 
          src="/imgs/profile.png" 
          alt="Profile Picture" 
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>

      <div className="flex flex-col gap-10 my-16">
        <Link 
          href="/"
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out ${
            isActive('/') 
              ? 'bg-[#DBECF8] shadow-inner' 
              : 'hover:bg-[#e8f6ff] hover:shadow-inner'
          }`}
        >
          <Image 
            src="/imgs/icon/home.svg" 
            alt="Home Icon" 
            width={28}
            height={28}
          />
        </Link>
        
        <Link 
          href="/blog"
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out ${
            isActive('/blog') 
              ? 'bg-[#DBECF8] shadow-inner' 
              : 'hover:bg-[#e8f6ff] hover:shadow-inner'
          }`}
        >
          <Image 
            src="/imgs/icon/blog.svg" 
            alt="Blog Icon" 
            width={28}
            height={28}
          />
        </Link>
        
        <Link 
          href="/notes"
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out ${
            isActive('/notes') 
              ? 'bg-[#DBECF8] shadow-inner' 
              : 'hover:bg-[#e8f6ff] hover:shadow-inner'
          }`}
        >
          <Image 
            src="/imgs/icon/note.svg" 
            alt="Note Icon" 
            width={28}
            height={28}
          />
        </Link>
      </div>

      <Link 
        href="/settings"
        className="flex items-center justify-center p-2 rounded-full mt-auto hover:bg-[#e8f6ff] hover:shadow-inner transition-all duration-200 ease-in-out"
      >
        <Image 
          src="/imgs/icon/settings.svg" 
          alt="Settings Icon" 
          width={28}
          height={28}
        />
      </Link>
    </div>
  );
}