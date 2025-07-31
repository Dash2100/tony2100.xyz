'use client';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const mockNotes = [
  {
    id: 1,
    content: "海浪拍打著岸邊的礁石，發出陣陣悅耳的聲響。海鷗在天空中自由地翱翔，時而俯衝向海面，時而盤旋在半空中。漁船在遠方的海平線上若隱若現，像是畫家筆下的點點墨痕。夕陽西下時，整個天空都被染成了金黃色，美得令人屏息。",
    date: "2023年10月1日"
  },
  {
    id: 2,
    content: "今天學習了新的程式設計概念，感覺收穫滿滿。雖然過程有些困難，但突破難關後的成就感真的很棒。記錄下來提醒自己要持續學習進步。",
    date: "2024年3月15日"
  },
  {
    id: 3,
    content: "春天到了，櫻花盛開。走在公園的小徑上，粉色花瓣隨風飄落，如詩如畫。這樣的美景讓人心情愉悅，也提醒著我們要珍惜當下的美好時光。",
    date: "2024年4月8日"
  }
];

export default function Notes() {
  return (
    <div className="bg-[#EDF5FA] flex min-h-screen">
      <Sidebar />

      <div className="w-full p-16 max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-[#4E5969]">隨手記</h1>
          <h2 className="text-3xl font-medium text-[#4E5969]">無聊的時候隨手打下來的東西</h2>
        </div>

        <div className="flex flex-col gap-8 flex-grow">
          {mockNotes.map((note) => (
            <div key={note.id} className="bg-[#DBECF8] p-10 rounded-[30px] shadow-inner">
              <h3 className="text-[23px] font-medium text-[#4E5969] leading-relaxed">
                {note.content}
              </h3>
              <h3 className="text-[20px] font-medium text-[#4E5969] mt-5 ml-auto text-end">
                {note.date}
              </h3>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}