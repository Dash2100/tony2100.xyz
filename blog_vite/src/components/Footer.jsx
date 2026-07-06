/**
 * Shared footer. Lives in the app shell (outside the page transition) and uses
 * a single fixed max-width container so its width never changes between pages.
 *
 * Mobile (<sm): compact layout — avatar + name in a row, three full-width
 * labelled social buttons, tight centred legal lines.
 * Desktop (sm+): identity left / icon buttons right, divider, split legal.
 */
const SOCIALS = [
  { icon: 'world', label: '個人網站', short: '網站', href: 'https://tony2100.xyz' },
  { icon: 'github', label: 'GitHub', short: 'GitHub', href: 'https://github.com/Dash2100' },
  { icon: 'mail', label: 'Email', short: 'Email', href: 'mailto:tony@todev.me' },
];

const external = (href) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};

export default function Footer() {
  return (
    <div className="w-full max-w-325 mx-auto px-5 md:px-8 lg:px-16">
      <footer className="w-full rounded-[25px] md:rounded-[35px] bg-[var(--card-2)] shadow-inner mt-20 mb-24 lg:mb-8 p-5 sm:p-8 xl:px-12 flex flex-col gap-4 sm:gap-6">
        {/* identity (+ desktop icon buttons) */}
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 text-left">
            <img src="/imgs/profile.png" alt="Tony2100"
              className="h-14 w-14 sm:h-20 sm:w-20 rounded-full sm:rounded-[20px] shrink-0" />
            <div className="flex flex-col gap-0.5 md:gap-1 min-w-0">
              <h2 className="font-bold text-[var(--ink)] text-[17px] sm:text-xl noto-font leading-snug">Tony2100's Life Log</h2>
              <p className="text-[var(--ink)]/80 text-[13px] sm:text-base noto-font leading-snug">生活紀錄、技術筆記，還有一些胡思亂想。</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-3 md:gap-4 shrink-0">
            {SOCIALS.map(({ icon, label, href }) => (
              <a key={icon} href={href} aria-label={label} {...external(href)}
                className="bg-[var(--chip)] p-2.5 shadow-inner rounded-xl border border-[var(--ink)]/20 hover:bg-[var(--card-hover)] transition-colors duration-200">
                <img src={`/imgs/icon/${icon}.svg`} alt="" className="h-6 w-6 md:h-7 md:w-7 block" />
              </a>
            ))}
          </div>
        </div>

        {/* mobile: three equal labelled buttons */}
        <div className="grid grid-cols-3 gap-2.5 sm:hidden">
          {SOCIALS.map(({ icon, short, label, href }) => (
            <a key={icon} href={href} aria-label={label} {...external(href)}
              className="flex items-center justify-center gap-1.5 bg-[var(--chip)] border border-[var(--ink)]/20 shadow-inner rounded-xl py-2.5 text-[13px] text-[var(--ink)] noto-font active:scale-95 transition-transform duration-150">
              <img src={`/imgs/icon/${icon}.svg`} alt="" className="h-4 w-4 shrink-0" />
              <span className="truncate">{short}</span>
            </a>
          ))}
        </div>

        <hr className="border-none h-px bg-[var(--ink)]/15" />

        {/* legal — compact centred stack on mobile, split row on sm+ */}
        <div className="flex flex-col gap-1 text-center text-[12.5px] leading-relaxed text-[var(--ink)]/70 noto-font sm:hidden">
          <p>© Tony2100 · All rights reserved.</p>
          <p>
            文章採用 <a className="text-[var(--link)]" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hant"
              target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 授權，轉載請註明出處。
          </p>
          <p>部分圖片來自網路，如有侵權請來信告知。</p>
        </div>
        <div className="hidden sm:flex flex-col md:flex-row md:items-end md:justify-between gap-1.5 md:gap-6 text-left text-sm text-[var(--ink)]/75 noto-font">
          <p>© Tony2100 · All rights reserved.</p>
          <div className="flex flex-col gap-1.5 md:items-end">
            <p>
              文章除特別聲明外，均採用 <a
                className="text-[var(--link)] hover:underline underline-offset-2"
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
