'use client';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Settings() {
  return (
    <div className="bg-[#EDF5FA] flex min-h-screen">
      <Sidebar />
      
      <div className="w-full p-16 max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-[#4E5969]">設定</h1>
          <h2 className="text-3xl font-medium text-[#4E5969]">網站設定與偏好</h2>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="bg-[#f7fafd] shadow-inner rounded-[35px] p-8">
            <h3 className="text-[28px] font-semibold text-[#4E5969] mb-6">一般設定</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[#4E5969] text-[18px]">深色模式</span>
                <button className="bg-[#DBECF8] px-6 py-2 rounded-[15px] shadow-inner hover:bg-[#e8f6ff] transition-all duration-200 ease-in-out text-[#4E5969] font-medium">
                  切換
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4E5969] text-[18px]">語言設定</span>
                <select className="bg-[#DBECF8] px-6 py-2 rounded-[15px] shadow-inner text-[#4E5969] font-medium border border-[#4E5969]/20">
                  <option>繁體中文</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#f7fafd] shadow-inner rounded-[35px] p-8">
            <h3 className="text-[28px] font-semibold text-[#4E5969] mb-6">帳戶設定</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[#4E5969] text-[18px]">個人資料</span>
                <button className="bg-[#DBECF8] px-6 py-2 rounded-[15px] shadow-inner hover:bg-[#e8f6ff] transition-all duration-200 ease-in-out text-[#4E5969] font-medium">
                  編輯
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4E5969] text-[18px]">更改密碼</span>
                <button className="bg-[#DBECF8] px-6 py-2 rounded-[15px] shadow-inner hover:bg-[#e8f6ff] transition-all duration-200 ease-in-out text-[#4E5969] font-medium">
                  設定
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}