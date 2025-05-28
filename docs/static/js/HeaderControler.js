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
// 获取需要动画控制的元素集合
const elements = [
    document.querySelector('.container'),
    document.querySelector('#content-container'),
    document.getElementById('cntrSearch'),
    document.getElementById('tabsContainer'),
    document.getElementById('changePage'),
    document.getElementById('changeBG')
].filter(Boolean);

// 初始化记录原始display值
elements.forEach(element => {
    const originalDisplay = window.getComputedStyle(element).display;
    element.dataset.originalDisplay = originalDisplay;
});

// 读取存储状态并直接应用
document.addEventListener('DOMContentLoaded', () => {
    const savedState = localStorage.getItem('simpleModeState');
    if (savedState === 'hidden') {
        elements.forEach(element => {
            element.style.display = 'none'; // 直接隐藏，不触发动画
        });
    }
});

function toggleElements(shouldHide) {
    elements.forEach(element => {
        element.classList.remove('enter', 'exit');

        if (shouldHide) {
            element.classList.add('exit');
            element.addEventListener('animationend', () => {
                element.style.display = 'none';
                localStorage.setItem('simpleModeState', 'hidden'); // 状态存储
            }, { once: true });
        } else {
            element.style.display = element.dataset.originalDisplay;
            element.classList.add('enter');
            localStorage.setItem('simpleModeState', 'shown'); // 状态存储
            element.addEventListener('animationend', () => {
                element.classList.remove('enter');
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
    toggleElements(isAnyVisible);
});

//简洁模式-----结束