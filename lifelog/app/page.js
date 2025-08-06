import React from 'react'

// side components
import SideNav from './components/common/SideNav'
import FeaturedPost from './components/common/FeaturedPost'
import Tags from './components/common/Tags'

// home components
import Cover from './components/home/Cover'
import PostCard from './components/common/PostCard'

import Footer from './components/common/Footer'

const page = () => {
    return (
        <div className='bg-base flex min-h-screen'>
            <SideNav />
            <div className="w-full items-center p-16 max-w-[1200px] mx-auto flex flex-col gap-8">

                {/* Home Cover */}
                <Cover />

                {/* Posts and SideInfo */}
                <div className="w-full flex gap-5">

                    {/* Posts Grid */}
                    <div className="grid grid-cols-2 gap-5">
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

                    {/* Side Information */}
                    <div className='flex flex-col gap-10'>
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

export default page