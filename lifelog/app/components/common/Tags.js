'use client';

const Tags = ({ tags = ['競賽', '北極熊', '旅遊', '體驗', '秦始皇', '程式開發'] }) => {
    return (
        <div className="w-[300px] h-fit bg-[#f7fafd] border-[1px] border-[#4E5969]/20 shadow-inner rounded-[35px] p-6 flex flex-col gap-4">
            <h2 className="text-[#4E5969] text-[22px] font-semibold noto-font">文章標籤</h2>
            <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) => (
                    <button
                        key={`${tag}-${index}`}
                        className="text-[#4E5969] text-[16px] px-4 py-1 noto-font border-[1px] border-[#4E5969]/20 rounded-[10px] shadow-inner w-fit transition-all duration-200 ease-in-out hover:bg-[#DBECF8] cursor-pointer"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tags;