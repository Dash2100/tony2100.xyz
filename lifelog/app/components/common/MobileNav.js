import Image from 'next/image'

const MobileNav = () => {
    return (
        <div className="w-dvw h-20 bg-[#EDF5FA] shadow-nav fixed bottom-0 flex items-center justify-center">
            {/* nav item */}
            <div className="flex justify-between w-10/12">
                <a href="#" className="flex items-center justify-center p-3 rounded-full bg-[#DBECF8] shadow-inner">
                    <Image src="/imgs/icon/home.svg" alt="Home Icon" width={28} height={28} className="h-7 w-7" />
                </a>
                <a href="#"
                    className="flex items-center justify-center p-3 rounded-full ease-in-out duration-200">
                    <Image src="/imgs/icon/blog.svg" alt="Blog Icon" width={28} height={28} className="h-7 w-7" />
                </a>
                <a href="#"
                    className="flex items-center justify-center p-3 rounded-full ease-in-out duration-200">
                    <Image src="/imgs/icon/note.svg" alt="Note Icon" width={28} height={28} className="h-7 w-7" />
                </a>
                <a href="#"
                    className="flex items-center justify-center p-3 rounded-full ease-in-out duration-200">
                    <Image src="/imgs/icon/settings.svg" alt="Settings Icon" width={28} height={28} className="h-7 w-7" />
                </a>
            </div>
        </div>
    )
}

export default MobileNav