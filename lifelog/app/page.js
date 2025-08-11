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

// hooks
import useMobileDetection from './hooks/useMobileDetection'

const page = () => {
    const { isMobile, isTablet, isDesktop } = useMobileDetection()

    return (
        <div className='bg-base flex min-h-screen'>
            {isMobile ? <MobileNav /> : <SideNav />}

            <div className={`w-full items-center ${isMobile ? 'p-4 pb-24' : isTablet ? 'p-8' : 'p-16'} max-w-[1200px] mx-auto flex flex-col gap-8`}>

                {/* Home Cover */}
                <Cover />

                {/* Posts and SideInfo */}
                <div className={`w-full flex ${isMobile || isTablet ? 'flex-col' : 'gap-5'} ${isMobile || isTablet ? 'gap-8' : ''}`}>

                    {/* Posts Grid */}
                    <div className={`
                        ${isMobile ? 'flex flex-col items-center gap-5' :
                            isTablet ? 'grid grid-cols-2 gap-5 justify-items-center' :
                                'grid grid-cols-2 gap-5'}
                        ${isDesktop ? 'flex-1' : 'w-full'}
                    `}>
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
                    {isDesktop && (
                        <div className='flex flex-col gap-10 w-[300px] flex-shrink-0'>
                            <FeaturedPost />
                            <Tags />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default page