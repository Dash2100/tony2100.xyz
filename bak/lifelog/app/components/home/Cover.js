"use client"

const Cover = () => {
    return (
        <div
            className="
                w-full mx-auto rounded-[35px] bg-cover bg-center bg-no-repeat text-[#4E5969]
                font-bold flex flex-col gap-3 items-center justify-center shadow-inner text-center mt-5
                h-[200px] px-6 py-12 text-[28px] leading-[38px] max-w-[365px]
                md:h-[230px] md:px-8 md:py-16 md:text-[34px] md:leading-[46px] md:max-w-none
                xl:h-[270px] xl:px-10 xl:py-20 xl:text-[40px] xl:leading-[55px]
            "
            style={{
                backgroundImage: "url('/imgs/banner.png')"
            }}>
            <h1 className="h-fit text-center">
                Tony2100&apos;s Life Log
            </h1>
            <h1 className="h-fit text-center text-lg md:text-2xl text-[#4E5969]">
                每個成功的男人背後，都有一條脊椎
            </h1>
        </div>
    )
}

export default Cover