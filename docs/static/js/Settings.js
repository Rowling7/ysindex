document.addEventListener('DOMContentLoaded', () => {
    // 读取存储的状态（默认亮色）
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    // 读取存储的状态（默认显示特效）
    const isVisible = localStorage.getItem('bgEffectsVisible') !== 'false';
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        canvasContainer.style.display = isVisible ? 'none' : 'block';
    }
    // 读取存储的状态（默认不显示壁纸）
    const isEnabled = localStorage.getItem("wallpaperEnabled") === "true";
    const body = document.body;
    if (isEnabled) {
        body.style.backgroundImage = "url(https://bing.ee123.net/img/)";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundSize = "cover";
        body.classList.add("has-bg");
    } else {
        body.style.backgroundImage = "none";
        body.classList.remove("has-bg");
    }
    // hover状态
    const siteFront = document.querySelector('.siteFornt');
    if (localStorage.getItem('hoverState') === 'active') {
        siteFront.classList.add('active');
    }
});

// 配置自定义选项（示例）
const menuItems = [
    {
        text: "主题设置",
        id: "toggleThemeItem",
        action: () => {
            toggleTheme();
            updateButtonText();
        },
    },
    { text: "启用壁纸", id: "changeBgImage", action: () => changeBgImage() }, //壁纸背景启用禁用
    {
        text: "BGeffects",
        id: "BGeffectsItem",
        action: () => BGeffectsItem(),
    },
    { text: "清除设置", id: "resetSettingsItem", action: () => resetSettingsItem() },
];

// 动态生成菜单
const dropdown = document.getElementById("settingsDropdown");
menuItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "dropdown-item";
    div.id = item.id;
    div.textContent = item.text;
    div.onclick = item.action;
    dropdown.appendChild(div);
});

// 显示/隐藏控制
document.getElementById("settingsBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    updateButtonText(); // 每次打开菜单时同步文本
});

// ================= 暗黑模式 =================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
// ================= 暗黑模式 =================

// ============= 壁纸背景启用禁用 ==============
function isWallpaperEnabled() {
    return document.body.classList.contains("has-bg");
}
function changeBgImage() {
    const body = document.body;
    const currentBg = getComputedStyle(body).backgroundImage;
    // 切换背景图状态
    if (currentBg === "none" || currentBg === "") {
        body.style.backgroundImage = "url(https://bing.ee123.net/img/)";
        body.style.backgroundRepeat = "no-repeat"; // 修正属性名和值格式
        body.style.backgroundSize = "cover"; // 修正属性名和值格式
        body.classList.add("has-bg"); // 添加控制类
        localStorage.setItem("wallpaperEnabled", "true"); // 存储启用状态
    } else {
        body.style.backgroundImage = "none";
        body.classList.remove("has-bg"); // 移除控制类
        localStorage.setItem("wallpaperEnabled", "false"); // 存储禁用状态
    }
}
// ============= 壁纸背景启用禁用 ==============


// ============= 背景特效隐藏显示 ==============
// 背景特效状态存储
function BGeffectsItem() {
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        const isVisible = window.getComputedStyle(canvasContainer).display !== 'none';
        // 切换状态并保存到 localStorage
        canvasContainer.style.display = isVisible ? 'none' : 'block';
        localStorage.setItem('bgEffectsVisible', !isVisible); // 存储新状态
    }
}
// ============= 背景特效隐藏显示 ==============

// ============= 重置设置 ==============
function resetSettingsItem() {
    // 清除所有相关存储项
    localStorage.removeItem('bgEffectsVisible');// 背景特效状态
    localStorage.removeItem('theme');   // 主题状态
    localStorage.removeItem('wallpaperEnabled');    //  壁纸状态
    localStorage.removeItem('selectedBackground');  // 背景图片
    localStorage.removeItem('simpleModeState'); // 简易模式状态
    localStorage.removeItem('hoverState');  // hover状态

    window.location.href = window.location.href; // 重新加载当前页面
}
// ============= 重置设置 ==============


// dropdownItem 文本更新
function updateButtonText() {
    // 主题按钮文本更新
    const themeItem = document.getElementById('toggleThemeItem');
    const isDark = document.body.classList.contains('dark-mode');
    themeItem.textContent = isDark ? '切换到亮色' : '切换到暗黑';
    // 壁纸按钮文本更新
    const btn = document.getElementById('changeBgImage');
    btn.textContent = isWallpaperEnabled() ? '禁用壁纸' : '启用壁纸';

    // 新增：背景特效按钮文本更新
    const bgEffectsBtn = document.getElementById('BGeffectsItem');
    const canvasContainer = document.querySelector('.canvas-container');
    if (bgEffectsBtn && canvasContainer) {
        const isVisible = window.getComputedStyle(canvasContainer).display !== 'none';
        bgEffectsBtn.textContent = isVisible ? '✓ bgeffects' : 'bgeffects';
    }
}

// 点击外部关闭
window.addEventListener("click", () => {
    dropdown.style.display = "none";
});
