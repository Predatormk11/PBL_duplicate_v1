const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemsContainer = document.querySelector('.forecast-item-container');

const apiKey = "9dfadc43f6e976f6b9642b826227b794"; // Replace with your OpenWeather API Key.

const getWeatherIcon = (id) => {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    return 'clouds.svg';
};

const showSection = (section) => {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => sec.style.display = 'none');
    section.style.display = 'flex';
};

const fetchData = async (endpoint, city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const updateWeatherInfo = async (city) => {
    const weatherData = await fetchData('weather', city);
    if (!weatherData || weatherData.cod !== 200) {
        showSection(notFoundSection);
        return;
    }
    const { name, main: { temp, humidity }, weather: [{ id, main }], wind: { speed } } = weatherData;

    countryTxt.textContent = name;
    tempTxt.textContent = `${Math.round(temp)}℃`;
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} m/s`;
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
    currentDateTxt.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

    await updateForecast(city);
    showSection(weatherInfoSection);
};

const updateForecast = async (city) => {
    const forecastData = await fetchData('forecast', city);
    forecastItemsContainer.innerHTML = '';
    forecastData.list.forEach(item => {
        const { dt_txt, main: { temp }, weather: [{ id }] } = item;
        const date = new Date(dt_txt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

        const forecastHTML = `
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${date}</h5>
                <img src="assets/weather/${getWeatherIcon(id)}" alt="${id}">
                <h5 class="forecast-item-temp">${Math.round(temp)}℃</h5>
            </div>`;
        forecastItemsContainer.insertAdjacentHTML('beforeend', forecastHTML);
    });
};

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim()) {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
    }
});
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim()) {
        updateWeatherInfo(cityInput.value.trim());
        cityInput.value = '';
    }
});
