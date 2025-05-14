//搜索功能
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const engine = document.getElementById('engineSelect').value;
    const query = this.q.value.trim();
    if (query) {
        window.location.href = engine + encodeURIComponent(query);
    }
});

// 检测系统主题-适配暗黑模式
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
function setTheme() {
    document.documentElement.setAttribute('data-bs-theme',
        prefersDark.matches ? 'dark' : 'light');
}
prefersDark.addEventListener('change', setTheme);
setTheme(); // 初始化


//快速搜索链接功能-----开始
const search = document.querySelector('.search');
const input = document.getElementById('inpt_search');

let isComposing = false;

input.addEventListener('compositionstart', () => {
    isComposing = true;
    search.classList.add('active'); // 强制锁定展开状态
});

input.addEventListener('compositionend', () => {
    isComposing = false;
    // 根据焦点状态决定是否保持
    if (document.activeElement !== input) search.classList.remove('active');
});

input.addEventListener('blur', () => {
    if (!isComposing) search.classList.remove('active');
});
//快速搜索链接功能-----结束

