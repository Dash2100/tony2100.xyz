"use client"

import React from 'react'

// side components
import SideNav from './components/common/SideNav'
import FeaturedPost from './components/common/FeaturedPost'
import Tags from './components/common/Tags'
import MobileNav from './components/common/MobileNav'

// home components
import Cover from './components/home/Cover'
import PostCard from './components/common/PostCard'

import Footer from './components/common/Footer'

const Page = () => {
    return (
        <div className='bg-base flex min-h-screen'>
            {/* Mobile Navigation - 只在小螢幕顯示 */}
            <div className='md:hidden'>
                <MobileNav />
            </div>
            
            {/* Desktop Navigation - 只在中等螢幕以上顯示 */}
            <div className='hidden md:block'>
                <SideNav />
            </div>

            <div className='w-full items-center p-4 pb-24 md:p-8 xl:p-16 max-w-[1200px] mx-auto flex flex-col gap-8'>

                {/* Home Cover */}
                <Cover />

                {/* Category - 只在手機版顯示 */}
                <h2 className='w-fit mx-auto font-bold text-[#4E5969] text-2xl px-4 py-2 border-b-2 border-[#4E5969]/20 md:hidden'>
                    推薦文章
                </h2>

                {/* Posts and SideInfo */}
                <div className='w-full flex flex-col gap-8 xl:flex-row xl:gap-5'>

                    {/* Posts Grid */}
                    <div className='flex flex-col items-center gap-5 md:grid md:grid-cols-2 md:gap-5 md:justify-items-center xl:flex-1'>
                        {[...Array(4)].map((_, i) => (
                            <PostCard
                                key={i}
                                title={`這是一段文章的標題文字 ${i + 1}`}
                                date={Math.floor(Date.now() / 1000) - (i * 86400)}
                                tags={['秦始皇', '北極熊']}
                                isPinned={i === 0}
                            />
                        ))}
                    </div>

                    {/* Side Information - 只在桌面版顯示 */}
                    <div className='hidden xl:flex flex-col gap-10 w-[300px] flex-shrink-0'>
                        <FeaturedPost />
                        <Tags />
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default Page