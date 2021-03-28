// Weather Dash

// Globals
let apiKey = "151e91eaeb0bb508a3423a19aa078cd3";
let storageArray = "cityArray";
let cityArray = [];

// Query Selectors
let recentListEl = document.getElementById("recent-list");
let clearEl = document.getElementById("clear");
let btnEl = document.querySelector(".btn");
let inputCityEl = document.querySelector(".user-city-name");

// Function calls
init();

// Function definitions
function init() {
    // Get recent search cities from localStorage
    let tempArray = JSON.parse(localStorage.getItem(storageArray));

    if (tempArray !== null) {
        cityArray = tempArray;
        renderRecentList();
    }
}

function addToCityArray(city) {
    // Check if city is already in array
    // If not in array add city to front of array
    let found = false; 

    found = cityArray.indexOf(city);
    if (found < 0) {
        // If the city is not in the array, add it
        cityArray.unshift(city);
    } else {
        // If the city is already in the array, move it to the first element
        cityArray.splice(found, 1);
        cityArray.unshift(city);
    }
    cityArray.splice(8);
}

function renderRecentList() {    
    // Clear recent list
    recentListEl.innerHTML = "";

    // Render li for each element in the cityArray
    for (let i = 0; i < cityArray.length; i++) {

        let liEl = document.createElement("li");

        liEl.textContent = cityArray[i];
        liEl.classList.add("list-group-item");
        recentListEl.appendChild(liEl);
    }
}

function storeRecentList() {
    // stringify the cityArray and store it in localStorage
    localStorage.setItem(storageArray, JSON.stringify(cityArray));
}

function clearRecentList() {
    // Clear the recent search list
    cityArray.splice(0);
    renderRecentList();
    storeRecentList();
}

function getForecast() {
    let city = "dallas";
    let apiKey = "151e91eaeb0bb508a3423a19aa078cd3";
    let requestURL = "http://api.openweathermap.org/data/2.5/forecast?q=Dallas&units=imperial&appid=5fe5cb892e1ae36d677d3e1b6d418a17";

    fetch(requestURL)
    .then(function (response) {
      console.log(response.status);
      //  Response.status.
      if (response.status !== 200) {
        console.log("There was an error with the search. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getCurrentWeather(city) {  
    let requestURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey;

    console.log(city);
    fetch(requestURL)
    .then(function (response) {
      //  Test response.status for error
      if (response.status !== 200) {
        alert("There was an error with the search. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data.main.temp);
    });
}

function submitCityName() {
    
    if(inputCityEl.value.trim() !== ""){
        addToCityArray(inputCityEl.value.trim());
        renderRecentList();
        storeRecentList();
    
        getCurrentWeather(inputCityEl.value.trim());
        //getForecast();
    }
    
    // Clear input value on screen
    inputCityEl.value = "";
    inputCityEl.focus();
}

// Event Listeners
btnEl.addEventListener("click", submitCityName);
clearEl.addEventListener("click", clearRecentList);


// On open...
// Populate recent search array from localStorage***
// Create and append elements for the recent searches from the recent search array***

// On click of search button...
// Capture search city***
// Add searched city to the front of the recent list array if it's not already in the list***
// Create and append elements for the recent searches from the recent search array***
// Save recent list array to localStorage***

// On click of clear list...
// Remove clicked city from recent list array***
// Create and append elements for the recent searches from the recent search array***
// Save recent list array to localStorage***

// Use search city to build url for weather service
// Fetch results from weather service for six days (today and 5 day forecast)
// Parse results and store in an array of weather objects
// Populate details section with results object
// Populate 5 day forecast
// Use data- to set weather icons

// Use search city to build url for UV index
// Fetch UV index for search city
// Parse results into variable
// Add index to details
// Change UV index background color based on value

// On click of recent city...
// Capture city from recent search button
// Fetch results from weather service ...

