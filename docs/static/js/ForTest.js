
//测试用功能，稳定后注释掉！！！！！
// 强制刷新缓存并重新加载网页
document.querySelector('.theme-toggle').addEventListener('click', function () {
    if (confirm('确定要强制刷新所有缓存吗？')) {
        // 保留主题设置
        const savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        if (savedTheme) localStorage.setItem('theme', savedTheme);
        // 动态资源缓存清除
        const timestamp = Date.now();
        // 1. 图片资源刷新
        document.querySelectorAll('img').forEach(img => {
            const newSrc = new URL(img.src);
            newSrc.searchParams.set('t', timestamp);
            img.src = newSrc.href;
        });
        // 2. 脚本/样式表刷新
        ['script[src]', 'link[rel="stylesheet"]'].forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const newUrl = new URL(el.href);
                newUrl.searchParams.set('t', timestamp);
                el.href = newUrl.href;
            });
        });
        // 3. 页面级强制刷新
        window.location.href = window.location.origin + window.location.pathname + `?forceReload=${timestamp}`;
    }
});
