"use client"

import useMobileDetection from '../../hooks/useMobileDetection'

const Cover = () => {
    const { isMobile, isTablet } = useMobileDetection()

    return (
        <div
            className={`
                w-full mt-5 mx-auto rounded-[35px] bg-[#DBECF8] text-[#4E5969]
                font-bold flex items-center justify-center shadow-inner text-center
                ${isMobile ? 'h-[200px] px-6 py-12 text-[28px] leading-[38px]' : ''}
                ${isTablet ? 'h-[230px] px-8 py-16 text-[34px] leading-[46px]' : ''}
                ${!isMobile && !isTablet ? 'h-[270px] px-10 py-20 text-[40px] leading-[55px]' : ''}
            `}>
            <h1 className="h-fit text-center">
                Tony2100's Life Log
                <br />
                {isMobile ? 'Cover Image' : 'Cover Image Placeholder'}
            </h1>
        </div>
    )
}

export default Cover