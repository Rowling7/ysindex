// 列表展示
/* 新增设备检测函数 */
function isMobile() {
    return window.innerWidth <= 1100;
}

// 列表展示
const columnControl = document.getElementById('columnCount');
const gridContainer = document.getElementById('content-container');
const columnBaseWidth = 200; // 单列基准宽度

/* 初始列数设置 */
const calculateColumns = () => {
    return Math.min(8, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)));
};
columnControl.value = calculateColumns(); // 统一调用

// 事件监听（新增resize时的列数调整）
columnControl.addEventListener('input', updateColumns);
columnControl.addEventListener('change', updateColumns);

// 优化后的防抖resize处理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        /* 根据当前设备类型调整列数 */
        if (isMobile()) {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)
            ));  // 手机默认4列
        } else {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)
            ));  // 电脑默认8列
        }
        updateColumns();
    }, 200);
});

function updateColumns() {
    const count = parseInt(columnControl.value);
    const containerWidth = gridContainer.offsetWidth;
    // 动态计算卡片宽度
    const gapTotal = 20 * (count - 1);
    const cardWidth = Math.max(20, (containerWidth - gapTotal) / count);
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.gridTemplateColumns = `repeat(${count}, minmax(${cardWidth}px, 1fr))`;
    });
}

// 数据加载逻辑
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const tabscontainer = document.getElementById('tabsContainer');
        const contentcontainer = document.getElementById('content-container');

        // 清空容器
        contentcontainer.innerHTML = '';
        tabscontainer.innerHTML = '';

        // 创建内容容器
        const wrapper = document.createElement('div');
        wrapper.className = 'content-wrapper';
        contentcontainer.appendChild(wrapper);

        // 使用文档片段减少DOM操作
        const tabFragment = document.createDocumentFragment();
        const contentFragment = document.createDocumentFragment();

        data.forEach((category, index) => {
            // 创建页签按钮
            const tabBtn = document.createElement('button');
            tabBtn.className = `tab-button${index === 0 ? ' active' : ''}`;
            tabBtn.textContent = category.name;
            tabBtn.dataset.tabIndex = index; // 显式绑定索引
            tabBtn.addEventListener('click', () => switchTab(index));
            tabFragment.appendChild(tabBtn);

            // 创建内容区
            const tabContent = document.createElement('div');
            tabContent.className = `tab-content${index === 0 ? ' active' : ''}`;

            // 使用map+join优化字符串拼接
            const cardsHTML = category.children.map(item => `
              <div class="card">
                  <a href="${item.target}" target="_blank" aria-label="${item.name}">
                      <img src="${item.bgImage}" alt="${item.name}" loading="lazy">
                      <h5>${item.name.slice(0, 8)}</h5>
                  </a>
              </div>
              `).join('');

            tabContent.innerHTML = cardsHTML; // 一次性插入
            contentFragment.appendChild(tabContent);
        });

        // 批量插入DOM元素
        tabscontainer.append(tabFragment);
        wrapper.append(contentFragment);

        // 初始化列数
        updateColumns();

        // 页签切换函数
        function switchTab(index) {
            const tabs = document.querySelectorAll('.tab-button');
            const contents = document.querySelectorAll('.tab-content');
            tabs.forEach((tab, i) => {
                tab.classList.toggle('active', i === index);
            });
            contents.forEach((content, i) => {
                content.classList.toggle('active', i === index);
            });
            updateColumns();
        }
    })
    .catch(error => console.error('数据加载失败:', error));