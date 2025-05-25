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
