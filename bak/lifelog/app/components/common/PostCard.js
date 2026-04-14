import Image from 'next/image'

const formatUnixToChineseDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year} 年 ${month} 月 ${day} 日`;
}

const PostCard = ({ tags = [], title, date, image = "/imgs/post-placeholder.png", isPinned = false }) => {
    return (
        <div
            className="w-full max-w-[365px] h-[345px] bg-[#f7fafd] border-[1px] border-[#4E5969]/20 shadow-inner rounded-[35px] flex flex-col gap-2 items-center p-8 select-none cursor-pointer group mx-auto">
            {/* Cover Image */}
            <div className="w-full h-[200px] bg-[#DBECF8] rounded-[20px] mb-2 shadow-inner overflow-hidden">
                <Image src={image} alt="Post Cover Image" width={365} height={200}
                    className="w-full h-full object-cover rounded-[20px] transition-transform duration-300 ease-in-out group-hover:scale-105" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 w-full flex-wrap">
                {isPinned && (
                    <span className="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-[10px] text-[15px] shadow-inner">
                        <Image src="/imgs/icon/pin.svg" alt="Tag Icon" width={16} height={16} className="inline my-auto" />
                        置頂
                    </span>
                )}
                {tags.map((tag, index) => (
                    <span key={index} className="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-[10px] text-[15px] shadow-inner">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Title and Date */}
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-[#4E5969] text-[22px] font-semibold noto-font">{title}</h2>
                <div className="flex gap-2">
                    <Image src="/imgs/icon/date.svg" alt="Calendar Icon" width={20} height={20} className="h-5 w-5 my-auto" />
                    <p className="text-[#4E5969] text-[14px] noto-font font-semibold my-auto">{formatUnixToChineseDate(date)}</p>
                </div>
            </div>
        </div>
    )
}

export default PostCard;