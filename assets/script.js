
// Past seach storage information
var pastSearches = [];

if(localStorage["pastSearches"]) {
    pastSearches = JSON.parse(localStorage[pastSearches]);
}

// Draw past searches
function drawPastSearches() {
    if(pastSearches.length) {
        var html = pastSearchesTemplate({search:pastSearches});
        $("#pastSearches").html(html);
    }
}

$(document).on("click", ".pastSearchLink", function(e) {
    e.preventDefault();
    var search = $(this).text();
    doSearch(search);
});

// API info for weather forecast
function weatherApi(){
const encodedParams = new URLSearchParams();
encodedParams.append("apiKey", "c35a4bee2emsh6c315d3399c090bp11f346jsnc0801ef84967");
encodedParams.append("locationKey", "city");

const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': 'c35a4bee2emsh6c315d3399c090bp11f346jsnc0801ef84967',
		'X-RapidAPI-Host': 'AccuWeatherstefan-skliarovV1.p.rapidapi.com'
	},
	body: encodedParams
};

fetch('https://accuweatherstefan-skliarovv1.p.rapidapi.com/get24HoursConditionsByLocationKey', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
}