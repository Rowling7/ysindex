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

//壁纸背景启用禁用-----开始
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
//壁纸背景启用禁用-----结束

//动态调整-----开始
/* 宽度检测函数 */
function isMobile() {
    return window.innerWidth <= 1100;
}

// 列表展示
const columnControl = document.getElementById("columnCount");
const gridContainer = document.getElementById("content-container");
const columnBaseWidth = 200; // 单列基准宽度
const tabsContainer = document.getElementById("tabsContainer");
const searchContainer = document.getElementById("search-container");

/* 初始列数设置 */
const calculateColumns = () => {
    return Math.min(8, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth))
    );
};
columnControl.value = calculateColumns(); // 统一调用

// 事件监听（新增resize时的列数调整）
columnControl.addEventListener("input", updateColumns);
columnControl.addEventListener("change", updateColumns);

// 优化后的防抖resize处理
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        /* 根据当前设备宽度调整列数 */
        if (isMobile()) {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)));
        } else {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)));
        }
        updateColumns();
        initWeightLayout();
    }, 200);
});

function updateColumns() {
    const count = parseInt(columnControl.value);
    const containerWidth = gridContainer.offsetWidth;
    // 动态计算卡片宽度
    const gapTotal = 20 * (count - 1);
    const cardWidth = Math.max(20, (containerWidth - gapTotal - 40) / count);
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.gridTemplateColumns = `repeat(${count}, minmax(${cardWidth}px, 1fr))`;
    });
}

function initWeightLayout() {
    if (isMobile()) {
        // 移动端样式设置
        //搜索栏
        searchContainer.style.transform = "translateX(30%) scale(1.5)";
        searchContainer.style.transformOrigin = "bottom center";
        searchContainer.style.padding = "15px";
        searchContainer.style.margin = "30px";
        //底栏
        tabsContainer.style.position = "absolute";  // 启用定位
        tabsContainer.style.left = "50%";           // 基于父容器居中
        tabsContainer.style.transform = `translateX(-50%) scale(1.2)`;
        tabsContainer.style.transformOrigin = "bottom center";
        tabsContainer.style.margin = "20px 0";
        tabsContainer.style.padding = "10px";
    } else {
        // 非移动端样式设置（恢复默认或初始样式）
        //搜索栏
        searchContainer.style.transform = "";
        searchContainer.style.transformOrigin = "";
        searchContainer.style.padding = "";
        searchContainer.style.margin = "0 auto";
        //底栏
        tabsContainer.style.position = "";  // 启用定位
        tabsContainer.style.left = "";
        tabsContainer.style.transform = "";
        tabsContainer.style.transformOrigin = "";
        tabsContainer.style.margin = "";
        tabsContainer.style.padding = "10px";
    }
}

// 在DOM加载完成后执行
document.addEventListener("DOMContentLoaded", initWeightLayout);
// 窗口大小变化时重新检测
window.addEventListener("resize", initWeightLayout);

//动态调整-----结束

fetch('static/data/gif-Base64.txt')
    .then(response => response.text())
    .then(data => {
        document.getElementById('image4Gif').src = data;
    });