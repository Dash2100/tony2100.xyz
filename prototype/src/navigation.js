// Navigation state management
function updateNavigation(activeNav) {
    // Desktop navigation
    const desktopNavs = ['home-nav-desktop', 'blog-nav-desktop', 'note-nav-desktop'];
    const mobileNavs = ['home-nav-mobile', 'blog-nav-mobile', 'note-nav-mobile'];

    // Reset all desktop nav items
    desktopNavs.forEach(navId => {
        const nav = document.getElementById(navId);
        if (nav) {
            nav.className = 'flex items-center justify-center p-2 rounded-full hover:bg-[#e8f6ff] hover:shadow-inner ease-in-out duration-200';
        }
    });

    // Reset all mobile nav items
    mobileNavs.forEach(navId => {
        const nav = document.getElementById(navId);
        if (nav) {
            nav.className = 'flex flex-col items-center justify-center p-3 rounded-full ease-in-out duration-200';
        }
    });

    // Set active nav
    if (activeNav === 'home') {
        const homeDesktop = document.getElementById('home-nav-desktop');
        const homeMobile = document.getElementById('home-nav-mobile');

        if (homeDesktop) {
            homeDesktop.className = 'flex items-center justify-center p-2 rounded-full bg-[#DBECF8] shadow-inner';
        }
        if (homeMobile) {
            homeMobile.className = 'flex flex-col items-center justify-center p-3 rounded-full bg-[#DBECF8] shadow-inner';
        }
    } else if (activeNav === 'blog') {
        const blogDesktop = document.getElementById('blog-nav-desktop');
        const blogMobile = document.getElementById('blog-nav-mobile');

        if (blogDesktop) {
            blogDesktop.className = 'flex items-center justify-center p-2 rounded-full bg-[#DBECF8] shadow-inner';
        }
        if (blogMobile) {
            blogMobile.className = 'flex flex-col items-center justify-center p-3 rounded-full bg-[#DBECF8] shadow-inner';
        }
    }
}
