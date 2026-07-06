/**
 * Shared footer. Lives in the app shell (outside the page transition) and uses
 * a single fixed max-width container so its width never changes between pages.
 */
export default function Footer() {
  return (
    <div className="w-full max-w-325 mx-auto px-5 md:px-8 lg:px-16">
      <div className="w-full rounded-[25px] md:rounded-[35px] bg-[#DBECF8] shadow-inner mt-20 mb-24 lg:mb-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 xl:gap-8 p-6 md:p-8 xl:px-12">
          <div className="flex gap-4 sm:gap-8 w-full xl:w-auto">
            <img src="/imgs/profile.png" alt="Profile Picture"
              className="h-16 sm:h-20 xl:h-24 rounded-[15px] xl:rounded-[20px] self-center sm:self-start" />
            <div className="flex flex-col gap-1 text-sm sm:text-base xl:text-lg my-auto">
              <h2 className="font-semibold text-[#4E5969]">© 2025 Tony2100. All rights reserved.</h2>
              <h2 className="font-semibold text-[#4E5969]">
                文章除特別聲明外，均採用 <a className="text-[#538AD9] cursor-pointer"
                  href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant" target="_blank" rel="noopener noreferrer">CC
                  BY-NC-SA4.0</a> 授權
              </h2>
              <h2 className="font-semibold text-[#4E5969]">轉載請註明出處。網站部分圖片來自網路，如有侵權請聯繫我。</h2>
            </div>
          </div>
          <div className="flex xl:flex-col justify-between xl:justify-normal gap-3 xl:gap-5 w-full xl:w-auto items-center xl:items-end">
            <div className="xl:w-full flex justify-center xl:justify-between gap-4">
              {['world', 'github', 'mail'].map((ic) => (
                <div key={ic}
                  className="bg-[#F3FAFF] p-2 shadow-inner rounded-xl w-fit h-fit justify-center items-start text-center border-2 border-[#4E5969]/20 cursor-pointer hover:bg-[#E8F6FF] ease-in-out duration-200">
                  <img src={`/imgs/icon/${ic}.svg`} alt={`${ic} Icon`} className="h-6 w-6 xl:h-7 xl:w-7 inline-block" />
                </div>
              ))}
            </div>
            <a href="https://notbyai.fyi/" target="_blank" rel="noopener noreferrer">
              <img src="/imgs/not-by-ai.png" alt="Not by AI" className="w-32 sm:w-40 xl:w-48" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
