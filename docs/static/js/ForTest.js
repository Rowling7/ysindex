// 添加全局样式
const style = document.createElement('style');
style.textContent = `
    .light-effect {
        position: fixed;
        pointer-events: none;
        z-index: -1; /* 确保在最底层 */
        border-radius: 50%;
        background: radial-gradient(
        circle,
        rgba(255,255,255,1) 0%,
        rgba(255,255,255,0.9) 10%,
        rgba(255,255,255,0.8) 20%,
        rgba(255,255,255,0.7) 30%,
        rgba(255,255,255,0.6) 40%,
        rgba(255,255,255,0.5) 50%,
        rgba(255,255,255,0.4) 60%,
        rgba(255,255,255,0.3) 70%,
        rgba(255,255,255,0.2) 80%,
        rgba(255,255,255,0.1) 90%,
        rgba(255,255,255,0) 100%
        );
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        filter: blur(50px); /* 添加轻微模糊使过渡更柔和 */
    }
`;
document.head.appendChild(style);

// 创建灯光元素
const lightElement = document.createElement('div');
lightElement.className = 'light-effect';
document.body.appendChild(lightElement);

// 跟踪鼠标位置
document.addEventListener('mousemove', (e) => {
    lightElement.style.left = `${e.clientX}px`;
    lightElement.style.top = `${e.clientY}px`;
});