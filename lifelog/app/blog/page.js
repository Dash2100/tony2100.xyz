'use client';

import Image from 'next/image';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FeaturedPostsList from '../components/FeaturedPostsList';
import TagsList from '../components/TagsList';

const featuredPosts = [
  {
    title: "全國技能競賽 網頁技術職種參賽心得",
    date: "2025 年 07 月 24 日"
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, natus?",
    date: "2025 年 07 月 24 日"
  },
  {
    title: "全國技能競賽 網頁技術職種參賽心得",
    date: "2025 年 07 月 24 日"
  }
];

const tags = ["競賽", "北極熊", "程式開發", "北極"];

export default function BlogPost() {
  return (
    <div className="bg-[#EDF5FA] flex min-h-screen">
      <Sidebar />

      <div className="w-full p-16 max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3">
            <span className="bg-[#DBECF8] text-[#4E5969] px-5 py-1 rounded-xl text-lg shadow-inner font-medium">
              競賽
            </span>
            <span className="bg-[#DBECF8] text-[#4E5969] px-5 py-1 rounded-xl text-lg shadow-inner font-medium">
              程式開發
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[45px] font-medium text-[#4E5969]">
              全國技能競賽 網頁技術職種參賽心得
            </h1>
            <div className="flex gap-2">
              <Image
                src="/imgs/icon/date-inpost.svg"
                alt="Calendar Icon"
                width={20}
                height={20}
              />
              <span className="text-[#4E5969] text-md font-semibold leading-5">
                2025年07月30日
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-6 max-w-full">
          <div className="flex flex-col gap-6 max-w-[1000px]">
            <div className="w-full h-[510px] bg-[#DBECF8] rounded-[35px] mb-2 shadow-inner overflow-hidden">
              <Image
                src="/imgs/post-placeholder.png"
                alt="Post Cover Image"
                width={1000}
                height={510}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full bg-[#f7fafd] shadow-inner min-h-96 rounded-[35px] px-10 py-8 flex flex-col gap-6">
              <h2 className="text-[35px] font-semibold text-[#4E5969]">
                第一段落標題
              </h2>
              <p className="text-[#4E5969] text-[22px]">
                段落文字內容。這裡可以放置一些關於競賽的背景資訊、參賽動機或是相關的經歷分享。可以使用多種格式來強調重要的點，例如粗體、斜體或是列表等。
              </p>
              <p className="text-[#4E5969] text-[22px]">
                段落文字內容。這裡可以放置一些關於競賽的背景資訊、參賽動機或是相關的經歷分享。可以使用多種格式來強調重要的點，例如粗體、斜體或是列表等。
              </p>
              <p className="text-[#4E5969] text-[22px]">
                段落文字內容。這裡可以放置一些關於競賽的背景資訊、參賽動機或是相關的經歷分享。可以使用多種格式來強調重要的點，例如粗體、斜體或是列表等。
              </p>
              <h2 className="text-[35px] font-semibold text-[#4E5969]">
                第二段落標題
              </h2>
              <p className="text-[#4E5969] text-[22px]">
                段落文字內容。這裡可以放置一些關於競賽的背景資訊、參賽動機或是相關的經歷分享。可以使用多種格式來強調重要的點，例如粗體、斜體或是列表等。
              </p>
              <p className="text-[#4E5969] text-[22px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima commodi consequuntur unde,
                distinctio debitis architecto eos quos? Atque reiciendis eligendi officiis recusandae, facere
                laboriosam molestias veritatis error illum suscipit maxime ullam adipisci molestiae praesentium
                culpa temporibus voluptates tempora tenetur amet cupiditate veniam expedita illo quidem.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="h-[510px] mb-8"></div>
            <div className="flex flex-col gap-8 sticky top-8">
              <div className="bg-[#f7fafd] shadow-inner rounded-[35px] px-8 py-6 flex flex-col gap-4">
                <h2 className="text-[28px] font-semibold text-[#4E5969]">目錄</h2>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <a
                      href="#section1"
                      className="text-[#4E5969] text-lg font-bold hover:text-[#2D739A] flex items-center"
                    >
                      <Image
                        src="/imgs/icon/list-arrow.svg"
                        alt="Section 1 Icon"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      第一段落標題
                    </a>
                    <a
                      href="#section2"
                      className="text-[#4E5969] text-lg font-medium hover:text-[#2D739A] ml-8"
                    >
                      第二段落標題
                    </a>
                  </div>
                </div>
              </div>

              <FeaturedPostsList posts={featuredPosts} />
              <TagsList tags={tags} />
            </div>
          </div>
        </div>

        <div className="mt-40">
          <Footer />
        </div>
      </div>
    </div>
  );
}