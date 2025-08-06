'use client';

const FeaturedPostCard = ({ title, date }) => {
    return (
        <div className="flex flex-col border-[1px] border-[#4E5969]/20 w-full px-4 py-[10px] rounded-[15px] shadow-inner gap-[2px] select-none cursor-pointer hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">
            <p className="text-[#4E5969] text-[15px] noto-font truncate">{title}</p>
            <div className="flex gap-1">
                <img src="./imgs/icon/date.svg" alt="Calendar Icon" className="h-4 w-4 my-auto" />
                <p className="text-[#4E5969] text-[13px] noto-font">{date}</p>
            </div>
        </div>
    )
}

const FeaturedPost = () => {
    return (
        <div className="w-[300px] h-fit bg-[#f7fafd] border-[1px] border-[#4E5969]/20 shadow-inner rounded-[35px] p-6 flex flex-col gap-4">
            <div className="flex justify-between">
                <h2 className="text-[#4E5969] text-[22px] font-semibold noto-font">熱門文章</h2>
                <button className="text-[#4E5969] text-[14px] font-semibold noto-font border-[1px] border-[#4E5969]/20 px-4 rounded-[10px] shadow-inner h-8 hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">
                    更多
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 items-center">
                    <FeaturedPostCard
                        title="全國技能競賽 網頁技術職種參賽心得"
                        date="2025 年 07 月 24 日"
                    />
                    <FeaturedPostCard
                        title="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, natus?"
                        date="2025 年 07 月 24 日"
                    />
                    <FeaturedPostCard
                        title="全國技能競賽 網頁技術職種參賽心得"
                        date="2025 年 07 月 24 日"
                    />
                </div>
            </div>
        </div>
    )
}

export default FeaturedPost