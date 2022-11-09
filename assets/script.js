var city = []

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

// API info for weather forecast
var getWeather = function (weatherApi) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c35a4bee2emsh6c315d3399c090bp11f346jsnc0801ef84967',
			'X-RapidAPI-Host': 'dark-sky.p.rapidapi.com'
		}
	};

	fetch('https://dark-sky.p.rapidapi.com/%7Blatitude%7D,%7Blongitude%7D?units=auto&lang=en', options)
		.then(response => response.json())
		.then(response => console.log(response))
		.catch(err => console.error(err));
}