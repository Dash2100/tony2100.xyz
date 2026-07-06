/**
 * Shared footer. Lives in the app shell (outside the page transition) and uses
 * a single fixed max-width container so its width never changes between pages.
 *
 * Layout: identity (avatar + site name + tagline) with social links on the
 * first row, a divider, then the legal lines. On mobile everything centers
 * into a single column.
 */
const SOCIALS = [
  { icon: 'world', label: '個人網站', href: '#' }, // TODO: 換成你的網站連結
  { icon: 'github', label: 'GitHub', href: '#' }, // TODO: 換成你的 GitHub 連結
  { icon: 'mail', label: 'Email', href: 'mailto:haco.tw@gmail.com' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="w-full max-w-325 mx-auto px-5 md:px-8 lg:px-16">
      <footer className="w-full rounded-[25px] md:rounded-[35px] bg-[#DBECF8] shadow-inner mt-20 mb-24 lg:mb-8 p-6 md:p-8 xl:px-12 flex flex-col gap-5 md:gap-6">
        {/* identity + socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 md:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
            <img src="/imgs/profile.png" alt="Tony2100"
              className="h-16 md:h-20 rounded-[15px] md:rounded-[20px] shrink-0" />
            <div className="flex flex-col gap-0.5 md:gap-1">
              <h2 className="font-bold text-[#4E5969] text-lg md:text-xl noto-font">Tony2100's Life Log</h2>
              <p className="text-[#4E5969]/80 text-sm md:text-base noto-font">生活紀錄、技術筆記，還有一些胡思亂想。</p>
            </div>
          </div>
          <div className="flex gap-3 md:gap-4 shrink-0">
            {SOCIALS.map(({ icon, label, href }) => (
              <a key={icon} href={href} aria-label={label}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="bg-[#F3FAFF] p-2.5 shadow-inner rounded-xl border border-[#4E5969]/20 hover:bg-white transition-colors duration-200">
                <img src={`/imgs/icon/${icon}.svg`} alt="" className="h-6 w-6 md:h-7 md:w-7 block" />
              </a>
            ))}
          </div>
        </div>

        <hr className="border-none h-px bg-[#4E5969]/15" />

        {/* legal */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1.5 md:gap-6 text-center md:text-left text-xs md:text-sm text-[#4E5969]/75 noto-font">
          <p>© 2025-{year} Tony2100 · All rights reserved.</p>
          <div className="flex flex-col gap-1.5 md:items-end">
            <p>
              文章除特別聲明外，均採用 <a
                className="text-[#538AD9] hover:underline underline-offset-2"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hant"
                target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 授權，轉載請註明出處。
            </p>
            <p>部分圖片來自網路，如有侵權請來信告知。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
