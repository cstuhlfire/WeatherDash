// Weather Dash

// Globals
let weatherObject = {
  cityName: "",
  weatherDate: "",
  icon: "",
  temp: "",
  humidity: "",
  windSpeed: "",
  longitude: "",
  latitude: "",
  uvi: "",
};

let forecastArray = [];
let forecastDays = 5;

let apiKey = "151e91eaeb0bb508a3423a19aa078cd3";
let storageArray = "cityArray"; // For local storage
let cityArray = [];

// Query Selectors
let recentListEl = document.getElementById("recent-list");
let clearEl = document.getElementById("clear");
let cityDetailEl = document.getElementById("city-detail");
let tempDetailEl = document.getElementById("temp-detail");
let humidDetailEl = document.getElementById("humid-detail");
let windDetailEl = document.getElementById("wind-detail");
let uviDetailEl = document.getElementById("uvi-detail");
let btnEl = document.querySelector(".btn");
let inputCityEl = document.querySelector(".user-city-name");
let forecastEl = document.querySelector("#forecast");
let cardHeaderEls = forecastEl.querySelectorAll(".card-header");
let cardBodyEls = forecastEl.querySelectorAll(".card-body");

// Function calls
init();

// Function definitions
function init() {
  // Get recent search cities from localStorage
  let tempArray = JSON.parse(localStorage.getItem(storageArray));

  if (tempArray !== null && tempArray.length > 0) {
    cityArray = tempArray;

    // Render recent searches and details
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

// Create list of recent searches on page
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

function renderDetails() {
  let iconCode = "\u2600";

  if (cityArray.length > 0) {
    cityDetailEl.textContent =
      weatherObject.cityName +
      " (" +
      weatherObject.weatherDate +
      ") " +
      iconCode;

    tempDetailEl.textContent = "Temperature: " + weatherObject.temp;
    humidDetailEl.textContent = "Humidity: " + weatherObject.humidity;
    windDetailEl.textContent = "Wind Speed: " + weatherObject.windSpeed;
    setUviStyle();
    uviDetailEl.textContent = weatherObject.uvi;

  }
}

function renderForecast() {
    let elementCount = cardHeaderEls.length;
 
    // For each forecast card, update its contents based on the forecastArray
    for (let i = 0; i < elementCount; i++) {
        console.log(forecastArray[i].forecastDate);
        cardHeaderEls[i].textContent = forecastArray[i].forecastDate;

        // loop through all the children
        // query select class card-text within each card
        console.log(cardBodyEls.length);
        let cardDetailEls = cardBodyEls[i].querySelectorAll("h5, p");
        for (let j = 0; j < cardDetailEls.length; j++) {

            if(cardDetailEls[j].textContent === "High:"){
                cardDetailEls[j].textContent = "High: "+forecastArray[i].tempMax+" °F";
            } else if (cardDetailEls[j].textContent === "Low:"){
                cardDetailEls[j].textContent = "Low: "+forecastArray[i].tempMin+" °F";
            } else if (cardDetailEls[j].textContent === "Humidity:"){
                cardDetailEls[j].textContent = "Humidity: "+forecastArray[i].humidity+"%";
            }
            
        }
    }
}

function setUviStyle() {
    // remove all UV index classes
    uviDetailEl.classList.remove("low-highlight", "medium-low", "medium-high", "high", "very-high");
 
    // Set background of UV index based on value
    if(weatherObject.uvi <= 2) {
        uviDetailEl.classList.add("low-highlight");
    } 
    else if (weatherObject.uvi > 2 && weatherObject.uvi <= 5) {
        uviDetailEl.classList.add("medium-low");
    } 
    else if (weatherObject.uvi > 5 && weatherObject.uvi <= 7) {
        uviDetailEl.classList.add("medium-high");
    } 
    else if (weatherObject.uvi > 7 && weatherObject.uvi <+ 10) {
        uviDetailEl.classList.add("high");
    } 
    else if (weatherObject.uvi > 10) {
        uviDetailEl.classList.add("very-high");
    }
}

// Write recent searches in localStorage
function storeRecentList() {
  // stringify the cityArray and store it in localStorage
  localStorage.setItem(storageArray, JSON.stringify(cityArray));
}

// Clear the recent search list
function clearRecentList() {
  cityArray = [];
  renderRecentList();
  storeRecentList();
}

function getForecast() {
  let city = "dallas";
  let apiKey = "151e91eaeb0bb508a3423a19aa078cd3";
  let requestURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat="+weatherObject.latitude+"&lon="+weatherObject.longitude+"&exclude=minutely,hourly,alerts&units=imperial&appid="+apiKey;

  fetch(requestURL)
    .then(function (response) {
      // Test response status
      if (response.status !== 200) {
        console.log("There was an error with the search. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
        for (let i = 0; i <= forecastDays; i++) {
    
            let myDate = parseDate(data.daily[i].dt);
            
            forecastArray[i] = {forecastDate: myDate,
                                  icon: data.daily[i].weather[0].icon,  
                                  tempMin: data.daily[i].temp.min, 
                                  tempMax: data.daily[i].temp.max,
                                  humidity: data.daily[i].humidity};
        }
 

      // console.log(forecastArray);
      //populate weatherObject with uvi and render city details
      weatherObject.uvi = data.current.uvi;
      renderDetails();
      renderForecast();
    });
}

function getCurrentWeather(city) {
  // Define URL with city and apiKey parameters
  let requestURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    apiKey;

  // Fetch data
  fetch(requestURL)
    .then(function (response) {
      //  Test response.status for error
      if (response.status !== 200) {
        alert("There was an error with the search city. Please try again.");
      }
      return response.json();
    })
    .then(function (data) {
      // If the data was returned, populate the weatherObject
      if (data.cod === 200) {
        // Parse the retrieved date from unix date to MM/DD/YYYY
        let myDate = parseDate(data.dt);

        // Populate weatherObject with returned data
        weatherObject.cityName = data.name;
        weatherObject.weatherDate = myDate;
        weatherObject.icon = data.weather[0].icon;
        weatherObject.temp = data.main.temp + " °F";
        weatherObject.humidity = data.main.humidity + "%";
        weatherObject.windSpeed = data.wind.speed + " MPH";
        weatherObject.longitude = data.coord.lon;
        weatherObject.latitude = data.coord.lat;
      } else {
        // If the fetch returned an error, set the cityName to the error message
        weatherObject.cityName = data.message;
      }

      getForecast();   
      
    });
    
  return;
}

function parseDate(longDate) {
    let myDate = new Date(longDate * 1000);
    myDate = moment(myDate).format("MM/DD/YYYY");

    return myDate;
}

function getWeatherUpdateList(city) {

    // get weather from OpenWeather API
    getCurrentWeather(city);
    
    addToCityArray(city);
    renderRecentList();
    storeRecentList();

}

function submitCityName() {
  // If the city named entered is not blank, then continue

  if (inputCityEl.value.trim() !== "") {
      getWeatherUpdateList(inputCityEl.value.trim());
  }

  // Clear input value on screen
  inputCityEl.value = "";
  inputCityEl.focus();
}

function getClickedCity(event) {
  getWeatherUpdateList(event.target.textContent);

}

// Event Listeners
btnEl.addEventListener("click", submitCityName);
clearEl.addEventListener("click", clearRecentList);
recentListEl.addEventListener("click", getClickedCity);

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

// Current Weather
// Use search city to build url for current weather***
// Fetch results from weather service Current Weather***
// Parse and store results in weather object***
// Populate details section with results object***
// Use data to set eather icons

// Use data to set eather icons
// Create mapping of data icon to emoji
// Look up emoji

// 5 Day Forcast
// Use search city to build url for weather service
// Fetch results from weather service for six days (today and 5 day forecast)
// Parse results and store in an array of weather objects
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
