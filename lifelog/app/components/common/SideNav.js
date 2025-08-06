'use client';

import Image from 'next/image'

const SideNav = () => {
    return (
        <div className="h-dvh w-[70px] px-2 py-10 bg-[#EDF5FA] shadow-nav flex flex-col items-center sticky top-0 left-0">

            {/* profile */}
            <div className="flex items-center justify-center">
                <Image src="/imgs/profile.png" alt="Profile Picture" width={48} height={48} className="h-12 w-12 rounded-full" />
            </div>

            {/* nav item */}
            <div className="flex flex-col gap-10 my-16">
                <a href="#" className="flex items-center justify-center p-2 rounded-full bg-[#DBECF8] shadow-inner">
                    <Image src="/imgs/icon/home.svg" alt="Home Icon" width={28} height={28} className="h-7 w-7" />
                </a>
                <a href="#"
                    className="flex items-center justify-center p-2 rounded-full hover:bg-[#e8f6ff] hover:shadow-inner ease-in-out duration-200">
                    <Image src="/imgs/icon/blog.svg" alt="Blog Icon" width={28} height={28} className="h-7 w-7" />
                </a>
                <a href="#"
                    className="flex items-center justify-center p-2 rounded-full hover:bg-[#e8f6ff] hover:shadow-inner ease-in-out duration-200">
                    <Image src="/imgs/icon/note.svg" alt="Note Icon" width={28} height={28} className="h-7 w-7" />
                </a>
            </div>

            {/* settings button */}
            <a href="#"
                className="flex items-center justify-center p-2 rounded-full mt-auto hover:bg-[#e8f6ff] hover:shadow-inner ease-in-out duration-200">
                <Image src="/imgs/icon/settings.svg" alt="Settings Icon" width={28} height={28} className="h-7 w-7" />
            </a>
        </div>
    )
}

export default SideNav