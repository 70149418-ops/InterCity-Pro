export const initTheme = () => {
    const themeSlider = document.getElementById('theme-slider');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || !currentTheme) {
        document.body.classList.add('dark-theme');
        if (themeSlider) themeSlider.checked = false;
    } else {
        document.body.classList.remove('dark-theme');
        if (themeSlider) themeSlider.checked = true;
    }
    if (themeSlider) {
        themeSlider.addEventListener('change', () => {
            if (!themeSlider.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
};