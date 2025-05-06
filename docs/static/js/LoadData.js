/* 新增设备检测函数 */
function isMobile() {
  return window.innerWidth <= 1100;
}
//其他的设备检测方法：
//function isMobile() {
//    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//}

// 列表展示
const columnControl = document.getElementById("columnCount");
const gridContainer = document.getElementById("content-container");
const columnBaseWidth = 200; // 单列基准宽度

/* 初始列数设置 */
const calculateColumns = () => {
  return Math.min(
    8,
    Math.max(1, Math.floor(window.innerWidth / columnBaseWidth))
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
    /* 根据当前设备类型调整列数 */
    if (isMobile()) {
      columnControl.value = Math.min(
        10,
        Math.max(1, Math.floor(window.innerWidth / columnBaseWidth))
      ); // 手机默认4列
    } else {
      columnControl.value = Math.min(
        10,
        Math.max(1, Math.floor(window.innerWidth / columnBaseWidth))
      ); // 电脑默认8列
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
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.gridTemplateColumns = `repeat(${count}, minmax(${cardWidth}px, 1fr))`;
  });
}
// 在数据加载成功后保存数据到全局变量
let globalData = []; // 新增全局变量存储数据
let currentActiveTabIndex = 0; // 新增当前激活索引存储

// 数据加载逻辑
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    globalData = data; // 保存数据到全局变量
    const tabscontainer = document.getElementById("tabsContainer");
    const contentcontainer = document.getElementById("content-container");

    // 清空容器
    contentcontainer.innerHTML = "";
    tabscontainer.innerHTML = "";

    // 创建内容容器
    const wrapper = document.createElement("div");
    wrapper.className = "content-wrapper";
    wrapper.id = "containerWrapper"; // 添加 ID 属性
    contentcontainer.appendChild(wrapper);

    // 使用文档片段减少DOM操作
    const tabFragment = document.createDocumentFragment();
    const contentFragment = document.createDocumentFragment();

    data.forEach((category, index) => {
      // 创建页签按钮
      const tabBtn = document.createElement("button");
      tabBtn.className = `tab-button${index === 0 ? " active" : ""}`;
      tabBtn.textContent = category.name;
      tabBtn.dataset.tabIndex = index; // 显式绑定索引
      tabBtn.addEventListener("click", () => switchTab(index));
      tabFragment.appendChild(tabBtn);

      // 创建内容区
      const tabContent = document.createElement("div");
      tabContent.className = `tab-content${index === 0 ? " active" : ""}`;

      // 使用map+join优化字符串拼接
      const cardsHTML = category.children
        .map(
          (item) => `
              <div class="card" id="linkCard">
                  <a href="${item.target}" target="_blank" aria-label="${
            item.name
          }" title="${item.name}">
                      <img src="${item.bgImage}" alt="${
            item.name
          }" loading="lazy">
                      <h5>${item.name.slice(0, 8)}</h5>
                  </a>
              </div>
              `
        )
        .join("");

      tabContent.innerHTML = cardsHTML; // 一次性插入
      contentFragment.appendChild(tabContent);
    });

    // 批量插入DOM元素
    tabscontainer.append(tabFragment);
    wrapper.append(contentFragment);

    // 初始化列数
    updateColumns();

    // 在loaddata.js的fetch().then()代码块末尾添加以下内容（在switchtab函数定义之后）
    // 添加左右点击切换功能
    if (!isMobile()) {
      const contentContainer = document.getElementById("bodyId");

      // 点击区域判断函数
      const getClickZone = (container, clickX) => {
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const clickPosition = clickX - rect.left;
        return clickPosition < containerWidth / 2 ? "left" : "right";
      };

      // 点击事件处理
      contentContainer.addEventListener("click", (e) => {
        // 新增：如果点击的是卡片链接或搜索头部则终止
        if (
          e.target.closest(".card") ||
          e.target.closest("#searchResultsHeader")
        ) {
          //console.log('点击的是卡片或搜索头部，跳过切换');
          return;
        }
        const currentTab = document.querySelector(".tab-button.active");
        const currentIndex = parseInt(currentTab.dataset.tabIndex);
        const totalTabs = document.querySelectorAll(".tab-button").length;

        // 点击排除逻辑。排除头部、搜索、底栏
        // 获取需要排除的三大容器元素
        const headerContainer = document.getElementById("headerContainer");
        const searchContainer = document.getElementById("search-container");
        const tabsContainer = document.getElementById("tabsContainer");
        //const linkCard = document.getElementById('linkCard');searchResultsHeader
        //console.error("1linkCard");
        // 定义通用区域检测函数
        function isInExcludeZone(clientY, element) {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return event.clientY >= rect.top && event.clientY <= rect.bottom;
        }
        // 在点击事件中执行检测
        if (
          isInExcludeZone(event.clientY, headerContainer) || // 检测头部区域
          isInExcludeZone(event.clientY, searchContainer) || // 检测搜索区域
          isInExcludeZone(event.clientY, tabsContainer) //||      // 检测底部区域
          //isInExcludeZone(event.clientY, linkCard)     // 检测头部区域
        ) {
          //console.error("2linkCard");
          return; // 命中排除区域则终止执行
        }

        const zone = getClickZone(contentContainer, e.clientX);
        let newIndex = currentIndex;

        if (zone === "left") {
          newIndex = (currentIndex - 1 + totalTabs) % totalTabs;
        } else {
          newIndex = (currentIndex + 1) % totalTabs;
        }
        switchTab(newIndex);
      });
    }
  })
  .catch((error) => console.error("数据加载失败:", error));

// 页签切换函数
function switchTab(index) {
  currentActiveTabIndex = index; // 更新全局索引
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
  contents.forEach((content, i) => {
    content.classList.toggle("active", i === index);
  });
  updateColumns();
}

// 添加搜索功能
document.getElementById("searchData").addEventListener("click", () => {
  const savedIndex = currentActiveTabIndex; // 保存当前激活索引
  const keyword = prompt("请输入要搜索的名称或链接:");
  if (!keyword) return;

  // 搜索所有分类的子项
  const searchResults = [];
  globalData.forEach((category) => {
    category.children.forEach((item) => {
      if (
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.target.toLowerCase().includes(keyword.toLowerCase())
      ) {
        searchResults.push(item);
      }
    });
  });

  // 更新显示结果
  const wrapper = document.getElementById("containerWrapper");
  const tabsContainer = document.getElementById("tabsContainer");

  // 隐藏标签页
  tabsContainer.style.display = "none";

  // 生成结果卡片
  const cardsHtml = searchResults
    .map(
      (item) => `
      <div class="card" id="linkcard">
        <a href="${item.target}" target="_blank" aria-label="${
        item.name
      }" title="${item.name}">
          <img src="${item.bgImage}" alt="${item.name}" loading="lazy">
          <h5>${item.name.slice(0, 8)}</h5>
        </a>
      </div>
    `
    )
    .join("");

  // 添加返回按钮和结果容器
  wrapper.innerHTML = `
      <div class="search-results-header" id="searchResultsHeader">
        <button class="back-button" id="backButton">< 返回 </button>
        <h3>找到 ${searchResults.length} 个匹配项</h3>
      </div>
      <div class="search-results-grid">${cardsHtml}</div>
    `;

  // 添加返回按钮事件
  document.getElementById("backButton").addEventListener("click", () => {
    tabsContainer.style.display = ""; // 恢复显示标签页
    // 重新初始化原始内容
    const contentFragment = document.createDocumentFragment();
    globalData.forEach((category, index) => {
      const tabContent = document.createElement("div");
      tabContent.className = `tab-content${
        index === savedIndex ? " active" : ""
      }`;
      // 使用map+join优化字符串拼接
      const cardsHTML = category.children
        .map(
          (item) => `
              <div class="card" id="linkCard">
                  <a href="${item.target}" target="_blank" aria-label="${
            item.name
          }" title="${item.name}">
                      <img src="${item.bgImage}" alt="${
            item.name
          }" loading="lazy">
                      <h5>${item.name.slice(0, 8)}</h5>
                  </a>
              </div>
              `
        )
        .join("");
      tabContent.innerHTML = cardsHTML; // 一次性插入
      contentFragment.appendChild(tabContent);
    });
    wrapper.innerHTML = "";
    wrapper.appendChild(contentFragment);
    switchTab(savedIndex); // 回到标签页
    updateColumns();
  });

  updateColumns();
});

/* 样式适配移动端 */
function initMobileLayout() {
  if (isMobile()) {
    const tabsContainer = document.getElementById("tabsContainer");
    tabsContainer.style.transform = "translateX(-50%) scale(2.5)"; // 水平居中补偿+核心缩放属性
    tabsContainer.style.transformOrigin = "bottom center"; // 从底部中心点缩放
    tabsContainer.style.margin = "20px 0"; // 防止内容挤压
    tabsContainer.style.padding = "15px"; //触控友好间距
    const searchContainer = document.getElementById("search-container");
    searchContainer.style.transform = "translateX(30%) scale(1.5)"; // 水平居中补偿+核心缩放属性
    searchContainer.style.transformOrigin = "bottom center"; // 从底部中心点缩放
    searchContainer.style.margin = "20px 0"; // 防止内容挤压
    searchContainer.style.padding = "15px"; //触控友好间距
    searchContainer.style.margin = "30px"; //触控友好间距
    const contentWrapper = document.getElementById("content-wrapper");
    contentWrapper.style.paddingBottom = document
      .getElementById("tabsContainer")
      .getBoundingClientRect().height;
    console.error(
      document.getElementById("tabsContainer").getBoundingClientRect().height
    );
  }
}

// 在DOM加载完成后执行
document.addEventListener("DOMContentLoaded", initMobileLayout);
// 窗口大小变化时重新检测
window.addEventListener("resize", initMobileLayout);
