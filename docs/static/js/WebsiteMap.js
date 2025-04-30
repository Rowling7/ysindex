//搜索功能
document.getElementById("searchForm").onsubmit = function () {
  var engine = document.getElementById("engineSelect").value;
  var query = document.querySelector('input[name="query"]').value;
  window.location.href = engine + encodeURIComponent(query);
  return false;
};

// 新增暗黑模式切换功能
const themeToggle = document.getElementById('themeToggle');

// 从本地存储加载主题设置
function loadTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.textContent = isDark ? '亮色模式' : '暗黑模式';
}

// 切换主题并保存设置
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '亮色模式' : '暗黑模式';
}

// 初始化主题设置
loadTheme();
themeToggle.addEventListener('click', toggleTheme);
