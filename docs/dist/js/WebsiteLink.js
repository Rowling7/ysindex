 // 页面DOM加载完成后执行以下代码
 document.addEventListener('DOMContentLoaded', function () {
    // 定义一个函数来处理表格切换逻辑
    function toggleTable(targetId) {
        // 获取所有折叠组件实例
        var collapseInstances = document.querySelectorAll('.collapse');
        collapseInstances.forEach(function (collapse) {
            // 先关闭所有已打开的折叠组件（解决可能存在的显示混乱问题）
            if (collapse.classList.contains('show')) {
                var collapseInstance = new bootstrap.Collapse(collapse);
                collapseInstance.hide();
            }
        });
        // 显示目标表格对应的折叠组件
        var targetCollapse = document.getElementById(targetId);
        if (targetCollapse) {
            var targetInstance = new bootstrap.Collapse(targetCollapse, { show: true });
            targetInstance.toggle();
        }
    }

    // 给显示用户表格按钮添加点击事件监听器
    document.getElementById('userTableBtn').addEventListener('click', function () {
        toggleTable('userTableCollapse');
    });

    // 给显示订单表格按钮添加点击事件监听器
    document.getElementById('orderTableBtn').addEventListener('click', function () {
        toggleTable('orderTableCollapse');
    });

    // 给显示商品表格按钮添加点击事件监听器
    document.getElementById('productTableBtn').addEventListener('click', function () {
        toggleTable('productTableCollapse');
    });

    // 给显示商家表格按钮添加点击事件监听器
    document.getElementById('merchantTableBtn').addEventListener('click', function () {
        toggleTable('merchantTableCollapse');
    });

    // 给显示库存表格按钮添加点击事件监听器
    document.getElementById('stockTableBtn').addEventListener('click', function () {
        toggleTable('stockTableCollapse');
    });

    // 初始化Tooltip组件
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    //暗黑模式切换
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", function () {
      const body = document.body;
      if (body.getAttribute("data-bs-theme") === "light") {
        body.setAttribute("data-bs-theme", "dark");
      } else {
        body.setAttribute("data-bs-theme", "light");
      }
    });
});


