var cityHistory = [];
// weather api and key
var weatherApi = 'https://api.openweathermap.org';
var weatherApiKey = 'd2692fd833256c6caad1fc0c4c32881a';

// Add timezone plugins
// var utc = require('dayjs/plugin/utc');
// var timezone = require('dayjs/plugin/timezone');

// dayjs.extend(utc);
// dayjs.extend(timezone);
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

var searchDoc = document.querySelector('#search-doc');
var citySearch = document.querySelector('#cityNameSearch');
var cityHistoryContainer = document.querySelector('#history');
var todayContainer = document.querySelector(`#today`);
var forecastContainer = document.querySelector('#forecast');




// Pull City Search from local storage
function initCityHistory() {
	var cityStored = localStorage.getItem('search-history');
	if (cityStored) {
		cityHistory = JSON.parse(cityStored);
	}
	renderCityHistory();
}

// Show history of Cities searched
function renderCityHistory() {
	cityHistoryContainer.innerHTML = '';

	// Show history with most recent listed first
	for (var i = cityHistory.length - 1; i >= 0; i--) {
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.setAttribute('aria-controls', 'today forecast');
		btn.classList.add('history-btn', 'btn-history');
		btn.setAttribute('data-search', cityHistory[i]);
		btn.textContent = cityHistory[i];
		cityHistoryContainer.append(btn);
	}
}

// To update history 
function appendHistory(search) {
	if (cityHistory.indexOf(search) !== -1) {
		return;
	}
	cityHistory.push(search);

	localStorage.setItem('search-history', JSON.stringify(cityHistory));
	renderCityHistory();
}

// Fetching location for the weather
function fetchWeather(location) {
	var { lat } = location;
	var { lon } = location;
	var city = location.name;

	//API path trying to us that gives an error saying page not found
	// var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=%7Bcity%7D&appid=d2692fd833256c6caad1fc0c4c32881a&units=metric`

	//API path that calls the key and includes lat and lon
	// var apiUrl = `${weatherApi}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
	var apiUrl = `${weatherApi}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
	fetch(apiUrl)
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			renderItems(city, data);
		})
		.catch(function (err) {
			console.error(err);
		});

	}




//fetcho coordinates for city weather
function fetchLocation(search) {
	// var apiUrl =`api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=d2692fd833256c6caad1fc0c4c32881a`;
	
	var weatherApiKey = 'd2692fd833256c6caad1fc0c4c32881a';
	// var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=%7Bcity%7D&appid=d2692fd833256c6caad1fc0c4c32881a&units=metric`

	//Lat and lon are not called for this one in this location
	// var apiUrl = `${weatherApi}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

	var apiUrl = `${weatherApi}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

	fetch(apiUrl)
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			if (!data[0]) {
				alert('Not Located');
			} else {
				appendHistory(search);
				fetchWeather(data[0]);
			}
		})
		.catch(function (err) {
			console.error(err);
		});
}

// Fetch Current Weather
function renderCurrentWeather(city, weather) {
	var date = dayjs().format('M/D/YYYY');
	var tempF = weather.main.temp;
	var windMph = weather.wind.speed;
	var humidity = weather.main.humidity;
	var iconUrl = "http://openweathermap.org/img/wn/${a.weather[0].icon}@2x.png";
	var iconDescription = weather.weather[0].description || weather[0].main;

	//create cards for weather results
	var card = document.createElement('div');
	var cardBody = document.createElement('div');
	var heading = document.createElement('h3');
	var weatherIcon = document.createElement('img');
	var tempEl = document.createElement('p');
	var windEl = document.createElement('p');
	var humidityEl = document.createElement('p');

	card.setAttribute('class', 'card');
	cardBody.setAttribute('class', 'card-body');
	card.append(cardBody);
	heading.setAttribute('class', 'h4 card-title');
	tempEl.setAttribute('class', 'card-text');
	windEl.setAttribute('class', 'card-text');
	humidityEl.setAttribute('class', 'card-text');

	heading.textContent = `${city} (${date})`;
	weatherIcon.setAttribute('src', iconUrl);
	weatherIcon.setAttribute('alt', iconDescription);
	weatherIcon.setAttribute('class', 'weather-img');
	heading.append(weatherIcon);
	tempEl.textContent = `Temp: ${tempF}°F`;
	windEl.textContent = `Wind: ${windMph} MPH`;
	humidityEl.textContent = `Humidity: ${humidity} %`;
	cardBody.append(heading, tempEl, windEl, humidityEl);

	todayContainer.innerHTML = '';
	todayContainer.append(card);
}

//Function to view forecast from API
function renderForecastCard(forecast) {
	var iconUrl = "http://openweathermap.org/img/wn/${a.weather[0].icon}@2x.png";
	var iconDescription = forecast.weather[0].description;
	var tempF = forecast.main.temp;
	var windMph = forecast.wind.speed;
	var humidity = forecast.main.humidity;

	

	//create cards for weather results
	var col = document.createElement('div');
	var card = document.createElement('div');
	var cardBody = document.createElement('div');
	var cardTitle = document.createElement('h4');
	var weatherIcon = document.createElement('img');
	var tempEl = document.createElement('p');
	var windEl = document.createElement('p');
	var humidityEl = document.createElement('p');

	col.append(card);
	card.append(cardBody);
	cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

	cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
	weatherIcon.setAttribute('src', iconUrl);
	weatherIcon.setAttribute('alt', iconDescription);
	tempEl.textContent = `Temp: ${tempF}°F`;
	windEl.textContent = `Wind: ${windMph} MPH`;
	humidityEl.textContent = `Humidity: ${humidity} %`;
	forecastContainer.append(col);
}

// 5 day forcast display
function renderForecast(dailyForecast) {
	var startDay = dayjs().add(1, 'day').startOf('day').unix();
	var endDay = dayjs().add(6, 'day').startOf('day').unix();
	var headingCol = document.createElement('div');
	var heading = document.createElement('h4');
	headingCol.setAttribute('class', 'col-12');
	heading.textContent = '5-Day Forecast:';
	headingCol.append(heading);
	forecastContainer.innerHTML = '';
	forecastContainer.append(headingCol);

	for (var i = 0; i < dailyForecast.length; i++) {
		if (dailyForecast[i].dt >= startDay && dailyForecast[i].dt < endDay) {
			if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
				renderForecastCard(dailyForecast[i]);
			}
		}
	}
}

function renderItems(city, data) {
	renderCurrentWeather(city, data.list[0], data.city.timezpne);
	renderForecast(data.list);
}

// Function to run City Search and save
function handleSearchForm(def) {
	if (!citySearch.value) {
		return;
	}
	def.preventDefault();
	var search = citySearch.value.trim();
	fetchLocation(search);
	citySearch.value = '';
}

// Function to pull search history
function historySearchClick(def) {
	if (!def.target.matches('.btn-history')) {
		return;
	}
	var btn = def.target;
	var search = btn.getAttribute('data-search');
	fetchLocation(search);
}

initCityHistory();
searchDoc.addEventListener('submit', handleSearchForm);
cityHistoryContainer.addEventListener('click', historySearchClick);
// _____________________________________________________
