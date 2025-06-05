// weatherComponent.js
class WeatherWidget {
  constructor(options = {}) {
    // 默认配置
    this.defaultOptions = {
      containerId: 'weatherWidgetContainer', // 默认容器ID
      apiKey: '269d058c99d1f3cdcd9232f62910df1d', // OpenWeatherMap API Key
      defaultCity: 'Weihai', // 默认城市
      cityDataPath: 'static/data/city.json'  //城市数据路径
    };

    // 合并用户配置
    this.options = { ...this.defaultOptions, ...options };

    // 初始化
    this.init();
  }

  async init() {
    // 创建容器
    this.createContainer();

    // 加载城市数据
    await this.loadCityData();

    // 渲染组件
    this.render();

    // 默认查询天气
    this.getWeather();

    // 绑定事件
    this.bindEvents();
  }

  createContainer() {
    // 如果容器不存在则创建
    if (!document.getElementById(this.options.containerId)) {
      const container = document.createElement('div');
      container.id = this.options.containerId;
      document.body.appendChild(container);
    }
    this.container = document.getElementById(this.options.containerId);
  }

  async loadCityData() {
    console.log('Requesting city data from:', this.options.cityDataPath);
    if (!this.options.cityDataPath) {
      console.error('缺少cityDataPath配置');
      return;
    }
    try {
      const response = await fetch(this.options.cityDataPath );
      if (!response.ok) throw new Error('网络响应不正常');

      const data = await response.json();
      if (!data.city) throw new Error('城市数据格式错误');

      this.cityData = data.city.flatMap(group => group.list);
    } catch (error) {
      console.error('加载城市数据失败:', error);
      alert("城市数据加载失败，请检查网络或文件路径！");
    }
  }

  render() {
    // 组件HTML结构
    this.container.innerHTML = `
      <div id="weatherWidget" class="weather-widget">
        <!-- 温度区域 -->
        <div id="weatherHead">
          <div id="weatherTemp"></div>
          <div class="temperature-extremes">
            <div id="weatherTempMax" title="最高温度"></div>
            <div id="weatherTempMin" title="最低温度"></div>
          </div>
          <img id="weatherimg" />
        </div>
        
        <!-- 输入区域 -->
        <div id="weatherInput">
          <select id="citySelect">
            <option value="Weihai">威海</option>
            <option value="Wuhan">武汉</option>
            <option value="Guiyang">贵阳</option>
            <option value="Beijing">北京</option>
            <option value="Shanghai">上海</option>
            <option value="Guangzhou">广州</option>
            <option value="Shenzhen">深圳</option>
          </select>
          <input type="text" id="cityInput" list="citySuggestions" placeholder="城市">
          <datalist id="citySuggestions"></datalist>
          <button id="weatherBtn">查询</button>
        </div>
        
        <!-- 主要天气信息 -->
        <div id="mainbody">
          <div id="weatherInfoRow1">
            <div id="site"></div>
            <div id="weatherResult"></div>
          </div>
        </div>
        
        <!-- 详细天气信息 -->
        <div id="detailedbody">
          <div class="weather-card">
            <div class="card-face front">
              <div class="detail-row">
                <div class="detail-label">体感温度</div>
                <div class="detail-value" id="feelsLike"></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">风速</div>
                <div class="detail-value" id="windSpeed"></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">风向</div>
                <div class="detail-value" id="windDeg"></div>
              </div>
            </div>
            <div class="card-face back">
              <div class="detail-row">
                <div class="detail-label">湿度</div>
                <div class="detail-value" id="weatherHumi"></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">大气压</div>
                <div class="detail-value" id="weatherPress"></div>
              </div>
              <div class="detail-row">
                <div class="detail-label">云量</div>
                <div class="detail-value" id="clouds"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 填充城市建议
    if (this.cityData) {
      const datalist = document.getElementById("citySuggestions");
      this.cityData.forEach(city => {
        const option = document.createElement("option");
        option.value = city.name;
        datalist.appendChild(option);
      });
    }

    // 设置默认城市
    document.getElementById("citySelect").value = this.options.defaultCity;;
  }

  bindEvents() {
    // 查询按钮事件
    document.getElementById("weatherBtn").addEventListener("click", () => this.getWeather());

    // 城市选择变化事件
    document.getElementById("citySelect").addEventListener("change", () => this.getWeather());

    // 城市输入变化事件
    document.getElementById("cityInput").addEventListener("change", () => this.getWeather());
  }

  getWeather() {
    let city;
    const inputValue = document.getElementById("cityInput").value.trim();

    if (inputValue === "") {
      city = document.getElementById("citySelect").value;
    } else {
      const isChinese = /[\u4e00-\u9fa5]/.test(inputValue);
      if (isChinese) {
        const matchedCity = this.cityData.find(item => item.name === inputValue);
        city = matchedCity ? matchedCity.pinyin : null;
      } else {
        city = inputValue;
      }
    }

    if (!city) return;

    // 发送天气请求
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.options.apiKey}`)
      .then(response => response.json())
      .then(weatherData => this.updateWeatherUI(weatherData))
      .catch(error => console.error('获取天气数据失败:', error));
  }

  // 获取风力等级
  getWindLevel(speed) {
    if (speed < 0.3) return '0级';
    if (speed < 1.6) return '1级';
    if (speed < 3.4) return '2级';
    if (speed < 5.5) return '3级';
    if (speed < 8.0) return '4级';
    if (speed < 10.8) return '5级';
    if (speed < 13.9) return '6级';
    if (speed < 17.2) return '7级';
    if (speed < 20.8) return '8级';
    if (speed < 24.5) return '9级';
    if (speed < 28.5) return '10级';
    if (speed < 32.7) return '11级';
    return '12级';
  }
  updateWeatherUI(weatherData) {
    // 天气描述翻译
    const weatherDescriptions = {
      'clear sky': '晴空',
      'few clouds': '少云',
      'scattered clouds': '散云',
      'broken clouds': '多云',
      'overcast clouds': '阴天',
      'shower rain': '阵雨',
      'rain': '雨',
      'light rain': '小雨',
      'moderate rain': '中雨',
      'heavy rain': '大雨',
      'thunderstorm': '雷暴',
      'snow': '雪',
      'light snow': '小雪',
      'heavy snow': '大雪',
      'mist': '薄雾',
      'fog': '雾',
      'haze': '霾',
      'dust': '尘',
      'sand': '沙尘',
      'smoke': '烟雾',
      'tornado': '龙卷风'
    };

    const englishDescription = weatherData.weather[0].description.toLowerCase();
    const chineseDescription = weatherDescriptions[englishDescription] || englishDescription;

    // 更新UI
    document.getElementById("weatherResult").innerHTML = chineseDescription;
    document.getElementById("weatherHumi").innerHTML = weatherData.main.humidity;

    const kdeg = (weatherData.main.temp - 273.15);
    document.getElementById("weatherTemp").innerHTML = kdeg.toFixed(1);

    const kdegmax = (weatherData.main.temp_max - 273.15);
    document.getElementById("weatherTempMax").innerHTML = kdegmax.toFixed(0) + "°";

    const kdegmin = (weatherData.main.temp_min - 273.15);
    document.getElementById("weatherTempMin").innerHTML = kdegmin.toFixed(0) + "°";

    document.getElementById("site").innerHTML = weatherData.name + " / " + weatherData.sys.country;
    document.getElementById("weatherimg").src = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/" + weatherData.weather[0].icon + ".png";
    document.getElementById("weatherPress").innerHTML = weatherData.main.pressure;

    const feelsLike = (weatherData.main.feels_like - 273.15).toFixed(0);
    document.getElementById("feelsLike").innerHTML = feelsLike + "°";
    // 添加风力等级描述
    const windSpeed = weatherData.wind.speed;
    const windLevel = this.getWindLevel(windSpeed);
    document.getElementById("windSpeed").innerHTML = `${windLevel} | ${windSpeed} m/s`;
    document.getElementById("clouds").innerHTML = weatherData.clouds.all + "%";

    const windDeg = weatherData.wind.deg;
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round((windDeg % 360) / 45) % 8;
    document.getElementById("windDeg").innerHTML = directions[index];
  }
}

// 导出类
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = WeatherWidget;
} else {
  window.WeatherWidget = WeatherWidget;
}