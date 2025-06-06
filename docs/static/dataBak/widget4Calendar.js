// CalendarWidget
class CalendarWidget {
    constructor(options = {}) {
        this.containerId = options.containerId || 'calendarContainer';
        this.date = new Date();
        this.calendarGrid = 35; // 7 * 6 grid
        this.init();
    }

    // 判断闰年
    isLeap(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // 获取月份天数
    getDays(year, month) {
        const feb = this.isLeap(year) ? 29 : 28;
        const daysPerMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysPerMonth[month - 1];
    }

    // 获取相邻月份信息
    getNextOrLastDays(date, type) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (type === 'last') {
            const lastMonth = (month === 1 ? 12 : month - 1);
            const lastYear = (month === 1 ? year - 1 : year);
            return {
                year: lastYear,
                month: lastMonth,
                days: this.getDays(lastYear, lastMonth)
            };
        }
        if (type === 'next') {
            const nextMonth = (month === 12 ? 1 : month + 1);
            const nextYear = (month === 12 ? year + 1 : year);
            return {
                year: nextYear,
                month: nextMonth,
                days: this.getDays(nextYear, nextMonth)
            };
        }
    }

    // 生成日历数据
    generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = this.getDays(year, month);
        const weekIndex = new Date(`${year}/${month}/1`).getDay(); // 0-6

        const { year: lastYear, month: lastMonth, days: lastDays } =
            this.getNextOrLastDays(date, 'last');
        const { year: nextYear, month: nextMonth } =
            this.getNextOrLastDays(date, 'next');

        const calendarTable = [];
        for (let i = 0; i < this.calendarGrid; i++) {
            if (i < weekIndex) {
                calendarTable[i] = {
                    year: lastYear,
                    month: lastMonth,
                    day: lastDays - weekIndex + i + 1,
                    isCurrentMonth: false
                };
            } else if (i >= days + weekIndex) {
                calendarTable[i] = {
                    year: nextYear,
                    month: nextMonth,
                    day: i + 1 - days - weekIndex,
                    isCurrentMonth: false
                };
            } else {
                calendarTable[i] = {
                    year: year,
                    month: month,
                    day: i + 1 - weekIndex,
                    isCurrentMonth: true
                };
            }
        }
        return calendarTable;
    }

    /**
     * 渲染日历
     */
    renderCalendar(create = false) {
        // 生成当前月份的日历数据
        const calendarData = this.generateCalendar(this.date);
        const title = document.getElementById('title');
        const year = this.date.getFullYear();
        const month = this.date.getMonth() + 1;
        const day = this.date.getDate();

        // 更新标题显示年月
        if (title) title.innerText = `${year}年${month}月`;

        const content = document.getElementById('content');
        if (!content) return;

        if (create) {
            // 创建新的日历按钮元素
            const fragment = document.createDocumentFragment();
            calendarData.forEach(item => {
                const button = document.createElement('button');
                const dateString = `${item.year}/${item.month}/${item.day}`;

                button.setAttribute('date', dateString);
                button.innerText = item.day;

                // 设置样式类：非当前月显示灰色，当前日期高亮
                if (!item.isCurrentMonth) button.classList.add('grey');
                if (item.day === day && item.month === month) {
                    button.classList.add('selected', 'today');
                }

                // 添加日期选择事件
                button.addEventListener('click', () => {
                    this.selectDate(button);
                    console.log(dateString);
                });

                fragment.appendChild(button);
            });
            content.appendChild(fragment);
        } else {
            // 更新现有日历按钮元素
            calendarData.forEach((item, idx) => {
                const button = content.children[idx];
                if (!button) return;

                // 重置样式并更新显示文本
                button.className = '';
                button.innerText = item.day;

                // 设置样式类：非当前月显示灰色，当前日期高亮
                if (!item.isCurrentMonth) button.classList.add('grey');
                if (item.day === day && item.month === month) {
                    button.classList.add('selected');
                }

                // 如果是今天则添加today类
                const today = new Date();
                if (today.getMonth() + 1 === month &&
                    today.getFullYear() === year &&
                    today.getDate() === item.day &&
                    item.isCurrentMonth) {
                    button.classList.add('today');
                }
            });
        }
    }

    // 改变月份
    changeMonth(type) {
        const newDays = this.getNextOrLastDays(this.date, type);
        this.date.setFullYear(newDays.year);
        this.date.setMonth(newDays.month - 1);
        this.date.setDate(1);
        this.renderCalendar();
    }

    // 选中日期
    selectDate(button) {
        const year = this.date.getFullYear();
        const month = this.date.getMonth() + 1;
        const newDay = Number(button.innerText);

        this.date.setDate(newDay);

        if (button.classList.contains('grey')) {
            let newMonth, newYear;
            if (newDay < 15) { // next
                newMonth = (month === 12 ? 1 : month + 1);
                newYear = (month === 12 ? year + 1 : year);
            } else { // last
                newMonth = (month === 1 ? 12 : month - 1);
                newYear = (month === 1 ? year - 1 : year);
            }
            this.date.setMonth(newMonth - 1);
            this.date.setFullYear(newYear);
        }
        this.renderCalendar();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // 注入HTML结构
        container.innerHTML = `
            <div id="calendar">
                <div class="header">
                <div class="btn-group">
                    <button class="left"><</button>
                    <button class="right">></button>
                </div>
                <h3 id="title"></h3>
                <button class="skipToToday">跳至今天</button>
                </div>
                <div class="week">
                <li>日</li>
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                </div>
                <div id="content"></div>
            </div>
    `;

        // 注入CSS
        const style = document.createElement('style');
        style.textContent = `
        #calendar {
            background: var(#2c3e50);
            color: var(#ecf0f1);
            font-family: 'Noto Sans SC', sans-serif;
            box-shadow: 0 8px 10px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: grid;
            border-radius: 16px;
            padding: 20px;
            width: 350px;
            margin: 10px auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            color: #333;
        }

        .header h3 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 500;
        }

        .header button {
            background: rgba(255, 255, 255, 0.3);
            border: none;
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #555;
        }

        .header button:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        .week {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            margin-bottom: 10px;
            color: #666;
            font-size: 0.9rem;
        }

        #content {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }

        #content button {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #333;
            font-size: 0.95rem;
        }

        #content button:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        #content button.today {
            font-weight: bold;
            color: #1a73e8;
        }

        #content button.selected {
            background: #1a73e8;
            color: white !important;
        }

        #content button.grey {
            color: #aaa;
            opacity: 0.7;
        }
        `;
        document.head.appendChild(style);

        // 初始化日历
        this.renderCalendar(true);

        // 绑定事件
        document.querySelector('.left').addEventListener('click', () => this.changeMonth('last'));
        document.querySelector('.right').addEventListener('click', () => this.changeMonth('next'));
        document.querySelector('.skipToToday').addEventListener('click', () => {
            this.date = new Date();
            this.renderCalendar();
        });
    }
}