//根据访问的是localhost还是github决定图片加载gif还是icoico--开始
window.onload = function () {
    const imgElement = document.getElementById('image4Gif');
    const isGitHub = window.location.hostname.includes('github.io');

    if (isGitHub) {
        imgElement.src = 'static/ico/favicon.ico';
    } else {
        imgElement.src = 'static/ico/gif4head.gif';
    }
};
//根据访问的是localhost还是github决定图片加载gif还是icoico--结束


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
    if (!isComposing) {
        search.classList.remove('active');
        input.value = '';
    }
});
//快速搜索链接功能-----结束

//简洁模式-----开始
// 获取需要动画控制的元素集合
const elements = [
    document.querySelector('.container'),
    document.querySelector('#content-container'),
    document.getElementById('cntrSearch'),
    document.getElementById('tabsContainer'),
    document.getElementById('changePage'),
    document.getElementById('changeBG')
    //document.getElementById('settingsBtn')
].filter(Boolean); // 过滤空元素

// 初始化记录原始display值
elements.forEach(element => {
    const originalDisplay = window.getComputedStyle(element).display;
    element.dataset.originalDisplay = originalDisplay; // 存储原始显示状态
});

function toggleElements(shouldHide) {
    elements.forEach(element => {
        // 清理之前的动画类
        element.classList.remove('enter', 'exit');

        if (shouldHide) {
            // 隐藏流程：触发退出动画
            element.classList.add('exit');
            element.addEventListener('animationend', () => {
                element.style.display = 'none';
            }, { once: true }); // 自动解绑事件
        } else {
            // 显示流程：恢复显示后触发进入动画
            element.style.display = element.dataset.originalDisplay;
            element.classList.add('enter');
            element.addEventListener('animationend', () => {
                element.classList.remove('enter'); // 动画结束后清理类
            }, { once: true });
        }
    });
}

// 点击事件绑定
document.getElementById('siteTitle').addEventListener('click', () => {
    const isAnyVisible = elements.some(el =>
        el.style.display !== 'none' &&
        !el.classList.contains('exit')
    );
    toggleElements(isAnyVisible); // 智能判断显示状态
});
//简洁模式-----结束