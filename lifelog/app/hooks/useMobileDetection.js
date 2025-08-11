"use client"

import { useState, useEffect } from 'react'

const useMobileDetection = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true
    })

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth
            setScreenSize({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1200,
                isDesktop: width >= 1200
            })
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    return screenSize
}

export default useMobileDetection
