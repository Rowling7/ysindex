// 搜索功能-----开始
document.getElementById("searchForm").onsubmit = function () {
    var engine = document.getElementById("engineSelect").value;
    var query = document.querySelector('input[name="query"]').value; //  局部变量
    window.location.href = engine + encodeURIComponent(query);
    return false;
}
// 添加键盘回车支持
document.querySelector('input[name="query"]').addEventListener("keypress", function (e) { //  直接获取元素
    if (e.key === "Enter") {
        document.getElementById("searchForm").dispatchEvent(new Event("submit")); //  显式获取表单
    }
});
// 添加输入框自动聚焦
window.onload = function () {
    document.querySelector('input[name="query"]').focus(); //  直接获取元素
}
// 搜索功能-----结束


//暗黑模式部分-----开始
const themeToggle = document.getElementById('themeToggle');
// 从本地存储加载主题设置
function loadTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.textContent = isDark ? '亮色模式' : '暗黑模式';
}
// 切换主题并保存设置
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '亮色模式' : '暗黑模式';
}
// 初始化主题设置
loadTheme();
themeToggle.addEventListener('click', toggleTheme);
//暗黑模式部分-----结束


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


document.getElementById('siteTitle').addEventListener('click', function () {
    const body = document.body;
    const currentBg = getComputedStyle(body).backgroundImage;

    // 切换背景图状态
    if (currentBg === 'none' || currentBg === '') {
        body.style.backgroundImage = 'url(https://bing.ee123.net/img/)';
        body.style.backgroundRepeat = 'no-repeat';  // 修正属性名和值格式
        body.style.backgroundSize = 'cover';        // 修正属性名和值格式
        body.classList.add('has-bg'); // 添加控制类
    } else {
        body.style.backgroundImage = 'none';
        body.classList.remove('has-bg'); // 移除控制类
    }
});

