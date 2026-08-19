import { Home, User, FolderGit2, BookOpen, Mail, createIcons } from 'lucide';

export function initNavbarIcons() {
    const navItems = [
        { selector: 'nav ul li:nth-child(1) a', iconName: 'home', IconClass: Home },
        { selector: 'nav ul li:nth-child(2) a', iconName: 'user', IconClass: User },
        { selector: 'nav ul li:nth-child(3) a', iconName: 'folder-git-2', IconClass: FolderGit2 },
        { selector: 'nav ul li:nth-child(4) a', iconName: 'book-open', IconClass: BookOpen },
        { selector: 'nav ul li:nth-child(5) a', iconName: 'mail', IconClass: Mail }
    ];

    navItems.forEach(({ selector, iconName }) => {
        const link = document.querySelector(selector);
        if (link) {
            const text = link.textContent.trim();

            link.innerHTML = `
                <i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>
                <span>${text}</span>
            `;
            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.gap = '8px';
        }
    });

    // Initialize lucide icons
    createIcons({
        icons: {
            Home,
            User,
            FolderGit2,
            BookOpen,
            Mail
        }
    });
}
