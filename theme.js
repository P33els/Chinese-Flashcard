// Theme Toggle System
(function () {
    const THEME_KEY = 'cn-flashcard-theme';

    // Apply saved theme immediately (before DOM renders to prevent flash)
    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        // Update toggle button if it exists
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด';
        }
    }

    // Apply immediately
    applyTheme(getPreferredTheme());

    // Setup toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggle');
        if (btn) {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            btn.textContent = current === 'dark' ? '☀️' : '🌙';
            btn.title = current === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด';
            btn.addEventListener('click', function () {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }
    });
})();
