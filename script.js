$(document).ready(function () {
    var searchBtn = $("#searchBtn");

    initLocalStorage();

    if ((localStorage.getItem("prevCityWeatherSrch") != "[]")) {
        var currentSrchHist = JSON.parse(localStorage.getItem("prevCityWeatherSrch"));
        renderLastCity(currentSrchHist[0]);
    };