$(document).ready(function () {
    var searchBtn = $("#searchBtn");

    initLocalStorage();

    if ((localStorage.getItem("prevCityWeatherSrch") != "[]")) {
        var currentSrchHist = JSON.parse(localStorage.getItem("prevCityWeatherSrch"));
        renderLastCity(currentSrchHist[0]);
    };

    displaySearchHist();

    //city coordinates 

    $(document).on("click", "prvCity", function(e) {
        e.preventDefault();
        var cityName = $(this).attr("id");
        var apiKey = "6406ca836e96fe35d13d0645f945ad0b";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (results) {
            weatherForecast(results);
        });
    });

    searchBtn.on("click", function(e) {
        e.preventDefault();
        var cityName = $("#userInput").val();
        var apiKey = "6406ca836e96fe35d13d0645f945ad0b";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (results) {
            weatherForecast(results);
            addToSearchHist(results.name);
        });
    });

    function weatherForecast(results) {
        $(".hide").attr("class", "row");
        var currentCityName = results.name;
        $("currentCityInfo").text(currentCityName + " ");
        var currentCityLon = results.coord.lon;
        var currentCityLat = results.coord.lat;
        findWithCoords(currentCityLat, currentCityLon);
        var currentCityDt = results.sys.sunrise;
        dateConverter(currentCityDt);
        var currentWethIcon = results.weather[0].icon;
        weatherIcon(currentWethIcon);
    };
    
    function findWithCoords(currentCityCoLat, currentCityCoLon) {
        var apiKey = "6406ca836e96fe35d13d0645f945ad0b";
        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + currentCityCoLat + "&lon=" + currentCityCoLon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (results) {
            var currentCityTemp = results.current.temp;
            $("#currentTemp").text("Temperature: " + currentCityTemp + " \u00B0F");
            var currentCityHum = results.current.humidity;
            $("#currentHumid").text("Humidity: " + currentCityHum + "%");
            var currentCityWinSpeed = results.current.wind_speed;
            $("#currentWind").text("Wind Speed: " + currentCityWinSpeed + " MPH");
            var currentCityUvi = results.current.uvi;
            uviIndexSeverity(currentCityUvi);
            fiveDayForecast(results);
        });
    };

    function uviIndexSeverity(currentCityUvi) {
        $("#currentUvi").text("");
        var uviIndexText = $("<span>");
        uviIndexText.text("UV Index: ");
        $("#currentUvi").append(uviIndexText);
        var currentCityUviHolder = $("<span>");
        if (currentCityUvi >= 0 && currentCityUvi <= 2) {
            currentCityUviHolder.attr("class", "low-uvi");
        } else if (currentCityUvi > 2 && currentCityUvi <= 5) {
            currentCityUviHolder.attr("class", "moderate-uvi");
        } else if (currentCityUvi > 5 && currentCityUvi <= 7) {
            currentCityUviHolder.attr("class", "high-uvi");
        } else if (currentCityUvi > 7 && currentCityUvi <= 10) {
            currentCityUviHolder.attr("class", "very-high-uvi");
        } else if (currentCityUvi > 10) {
            currentCityUviHolder.attr("class", "extreme-uvi forecast-square");
        };
        currentCityUviHolder.text(currentCityUvi);
        $("#currentUvi").append(currentCityUviHolder);
    };

    