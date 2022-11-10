var cities = []
var formElement = document.querySelector('#cityForm')

// City Search form
var cityForm = function (event) {
	event.preventDefault();
	var city = inputbox.value.trim();
	if (city) {
		getWeather(city);
		get5Day(city);
		citites.unshift({ city });
		inputbox.value = "";
	} else {
		alert("Required: Name of City");
	}
	saveSearch();
	pastSearches(city);
	console.log(city)
}

// Past seach storage information
var pastSearches = [];

if (localStorage["pastSearches"]) {
	pastSearches = JSON.parse(localStorage[pastSearches]);
}

// Draw past searches
function drawPastSearches() {
	if (pastSearches.length) {
		var html = pastSearchesTemplate({ search: pastSearches });
		$("#pastSearches").html(html);
	}
}

$(document).on("click", ".pastSearchLink", function (e) {
	e.preventDefault();
	var search = $(this).text();
	doSearch(search);
});



//OpenWeather API key by city name
function weatherApi() {
	const options = {
		method: 'GET',
		headers: {
			'apiKey': 'd2692fd833256c6caad1fc0c4c32881a',
			'apiHost': 'api.openweathermap.org'
		}
	};
	fetch('api.openweathermap.org/data/2.5/forecast?q={city name}&appid={apiKey}', options)
		.then(response => response.json())
		.then(response => console.log(response))
		.catch(err => console.error(err));
}

//Display weather, needing icon, temp, windspeed and humidity.
var displayWeather = function(weather, city) {
	weatherElement.textContent="";
	citySearchElement.textContent=City;
}

//Event listeners
formElement.addEventListener("submit", cityForm);