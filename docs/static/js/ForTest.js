// 配置自定义选项（示例）
const menuItems = [
    { text: "主题设置", id: "toggleThemeItem", action: () => toggleTheme() },
    { text: "通知管理", id: "toggleBackgroundEffectsItem", action: () => toggleBackgroundEffects() },
    { text: "数据导出", id: "exportDataItem", action: () => exportData() }
];

// 动态生成菜单
const dropdown = document.getElementById('settingsDropdown');
menuItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dropdown-item';
    div.id = item.id;
    div.textContent = item.text;
    div.onclick = item.action;
    dropdown.appendChild(div);
});

// 显示/隐藏控制
document.getElementById('settingsBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    const themeItem = document.getElementById('toggleThemeItem');
    const isDark = document.body.classList.contains('dark-mode');
    themeItem.textContent = isDark ? '切换到亮色' : '切换到暗色';
});

// 点击外部关闭
window.addEventListener('click', () => {
    dropdown.style.display = 'none';
});
