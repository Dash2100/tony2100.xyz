"use client"

import useMobileDetection from '../../hooks/useMobileDetection'

const Cover = () => {
    const { isMobile, isTablet } = useMobileDetection()

    return (
        <div
            className={`
                w-full mx-auto rounded-[35px] bg-cover bg-center bg-no-repeat text-[#4E5969]
                font-bold flex flex-col gap-3 items-center justify-center shadow-inner text-center
                ${isMobile ? 'h-[200px] px-6 py-12 text-[28px] leading-[38px] max-w-[365px] mt-5' : ''}
                ${isTablet ? 'h-[230px] px-8 py-16 text-[34px] leading-[46px] mt-5' : ''}
                ${!isMobile && !isTablet ? 'h-[270px] px-10 py-20 text-[40px] leading-[55px] mt-5' : ''}
            `}
            style={{
                backgroundImage: "url('/imgs/banner.png')"
            }}>
            <h1 className="h-fit text-center">
                Tony2100's Life Log
            </h1>
            <h1 className="h-fit text-center text-lg md:text-2xl text-[#4E5969]">
                每個成功的男人背後，都有一條脊椎
            </h1>
        </div>
    )
}

export default Cover