const Footer = () => {
    return (
        <div className="w-full rounded-[35px] bg-[#DBECF8] shadow-inner select-none mt-auto">
            <div className="flex justify-between items-center gap-8 p-8 px-12">
                <div className="flex gap-8">
                    <img src="./imgs/profile.png" alt="My Profile Picture" className="h-24 rounded-[20px]" />
                    <div className="flex flex-col gap-1 text-[18px] my-auto">
                        <h2 className="font-semibold text-[#4E5969]">© 2025 Tony2100. All rights reserved.</h2>
                        <h2 className="font-semibold text-[#4E5969]">
                            本部落格所有文章除特別聲明外，均採用 <span className="text-[#538AD9] cursor-pointer hover:underline">CC BY-NC-SA4.0</span> 許可協議
                        </h2>
                        <h2 className="font-semibold text-[#4E5969]">轉載請註明來自本網站！</h2>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="w-full flex justify-between">
                        <div className="bg-[#F3FAFF] p-2 shadow-inner rounded-xl w-fit h-fit justify-center items-start text-center border-[2px] border-[#4E5969]/20 cursor-pointer hover:bg-[#E8F6FF] ease-in-out duration-200">
                            <img src="./imgs/icon/world.svg" alt="World Icon" className="h-7 w-7 inline-block" />
                        </div>
                        <div className="bg-[#F3FAFF] p-2 shadow-inner rounded-xl w-fit h-fit justify-center items-start text-center border-[2px] border-[#4E5969]/20 cursor-pointer hover:bg-[#E8F6FF] ease-in-out duration-200">
                            <img src="./imgs/icon/github.svg" alt="GitHub Icon" className="h-7 w-7 inline-block" />
                        </div>
                        <div className="bg-[#F3FAFF] p-2 shadow-inner rounded-xl w-fit h-fit justify-center items-start text-center border-[2px] border-[#4E5969]/20 cursor-pointer hover:bg-[#E8F6FF] ease-in-out duration-200">
                            <img src="./imgs/icon/mail.svg" alt="Mail Icon" className="h-7 w-7 inline-block" />
                        </div>
                    </div>
                    <img src="./imgs/not-by-ai.png" alt="Not by AI" className="w-48" />
                </div>
            </div>
        </div>
    )
}

export default Footer