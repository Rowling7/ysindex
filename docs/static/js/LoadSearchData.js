// 在数据加载成功后保存数据到全局变量
let globalData = []; // 新增全局变量存储数据
let currentActiveTabIndex = 0; // 新增当前激活索引存储
let contentfragment = null; // 新增全局变量

// 数据加载逻辑
fetch("static/data/data.json")
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
    contentFragment = document.createDocumentFragment();

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
      //<h5 class="${item.name.length > 10 ? "scrollable" : ""}">${item.name}</h5>
      // 使用map+join优化字符串拼接
      const cardsHTML = category.children
        .map(
          (item) => `
        <div class="card" id="linkCard">
            <a href="${item.target}" target="_blank" aria-label="${item.name}" title="${item.name}">
                <img src="${item.bgImage}" alt="${item.name}" loading="lazy">
                <h5>${item.name.slice(0, 10)}</h5>
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

    // 添加左右点击切换功能
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
        const dropdown = document.getElementById("settingsDropdown");
        if (
          e.target.closest(".card") ||
          e.target.closest("#searchResultsHeader") ||
          e.target.closest("#settingsDropdown") ||
          (dropdown && dropdown.style.display === "block")
        ) {
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
  })
  .catch((error) => console.error("数据加载失败:", error));

// 页签切换函数
function switchTab(index) {
  currentActiveTabIndex = index; // 更新全局索引
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");
  const oldContent = document.querySelector(".tab-content.active"); // 获取旧内容元素
  const newContent = document.querySelectorAll(".tab-content")[index]; // 获取新内容元素

  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
  /* 删除此行，改为通过动画事件控制 active 类
  contents.forEach((content, i) => {
    content.classList.toggle("active", i === index);
  });*/
  switchContent(oldContent, newContent);

  // 滚动到顶部
  const wrapper = document.getElementById("containerWrapper");
  if (wrapper) {
    wrapper.scrollTo({
      top: 0,
      behavior: "smooth"
    }); // 直接设置滚动位置
  }
  updateColumns();
}
//页面动画效果控制
function switchContent(oldContent, newContent) {
  const current = oldContent;
  if (current) {
    current.classList.add('exit');
    current.addEventListener('animationend', () => {
      current.classList.remove('active', 'exit');// 确保旧内容动画完成后才激活新内容
      activateNewContent(newContent);
    }, { once: true }); // 使用一次性事件监听
  } else {
    activateNewContent(newContent);
  }
}
//页面动画效果控制
function activateNewContent(newContent) {
  newContent.classList.add('enter', 'active'); // 同时激活状态
  // 监听动画结束事件替代 setTimeout
  newContent.addEventListener('animationend', () => {
    newContent.classList.remove('enter');
  }, { once: true });
}

// 搜索功能实现
document.getElementById("inpt_search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const savedIndex = currentActiveTabIndex;
    const keyword = e.target.value.trim();
    if (!keyword) return;

    // 执行搜索逻辑
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

    // 更新界面显示
    const wrapper = document.getElementById("containerWrapper");
    const tabsContainer = document.getElementById("tabsContainer");
    const cntr = document.querySelector(".cntr");

    // 隐藏原始内容（新增对底栏的隐藏）
    tabsContainer.style.display = "none";  // 隐藏页签栏
    cntr.style.display = "none";           // 隐藏底栏

    // 生成结果卡片
    const cardsHtml = searchResults
      .map(
        (item) => `
                <div class="card" id="linkCard">
                    <a href="${item.target}" target="_blank" aria-label="${item.name}" title="${item.name}">
                        <img src="${item.bgImage}" alt="${item.name}" loading="lazy">
                        <h5>${item.name.slice(0, 10)}</h5>
                    </a>
                </div>
                `
      )
      .join("");

    // 构建搜索结果界面
    wrapper.innerHTML = `
            <div class="search-results-header" id="searchResultsHeader" style="margin-bottom: 0px;">
                <button class="back-button" id="backButton">< 返回</button>
                <h3>找到 ${searchResults.length} 个匹配项</h3>
            </div>
            <div class="search-results-grid"style="padding: 20px;">${cardsHtml}</div>
        `;

    // 返回按钮功能
    document.getElementById("backButton").addEventListener("click", () => {
      tabsContainer.style.display = "";  // 恢复页签栏
      cntr.style.display = "";           // 恢复底栏
      wrapper.innerHTML = "";

      // 重新生成内容
      const newFragment = document.createDocumentFragment();
      globalData.forEach((category, index) => {
        const tabContent = document.createElement("div");
        tabContent.className = `tab-content${index === currentActiveTabIndex ? " active" : ""}`;
        tabContent.innerHTML = category.children
          .map(
            (item) => `
              <div class="card" id="linkCard">
                  <a href="${item.target}" target="_blank" aria-label="${item.name}" title="${item.name}">
                      <img src="${item.bgImage}" alt="${item.name}" loading="lazy">
                      <h5>${item.name.slice(0, 10)}</h5>
                  </a>
              </div>
              `
          )
          .join("");
        newFragment.appendChild(tabContent);
      });
      wrapper.appendChild(newFragment);
      switchTab(savedIndex);
      updateColumns();
    });
    updateColumns();
  }
});
