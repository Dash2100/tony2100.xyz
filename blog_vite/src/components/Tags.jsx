const base =
  'bg-[#DBECF8] text-[#4E5969] px-2.5 py-1 xl:px-3 rounded-lg xl:rounded-[10px] text-[13px] sm:text-sm xl:text-[15px] shadow-inner flex items-center';

export function TagItem({ children }) {
  return <span className={base}>{children}</span>;
}

export function TagIcon({ icon, children }) {
  return (
    <span className={`${base} gap-1`}>
      <img src={icon} alt="Tag Icon" className="h-3 w-3 xl:h-4 xl:w-4" />
      {children}
    </span>
  );
}
