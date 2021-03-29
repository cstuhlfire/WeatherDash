// Weather Dash

// Globals
let iconLookup = [
    {openCode:"01d", uniCode:"\u2600"},
    {openCode:"02d", uniCode:"\u26C5"},
    {openCode:"03d", uniCode:"\u2601"},
    {openCode:"04d", uniCode:"\u26C5"},
    {openCode:"09d", uniCode:"\u2614"},
    {openCode:"10d", uniCode:"\u2614"},
    {openCode:"11d", uniCode:"\u26C8"},
    {openCode:"13d", uniCode:"\u2744"},
    {openCode:"50d", uniCode:"\u2602"},
    {openCode:"01n", uniCode:"\u2600"},
    {openCode:"02n", uniCode:"\u26C5"},
    {openCode:"03n", uniCode:"\u2601"},
    {openCode:"04n", uniCode:"\u26C5"},
    {openCode:"09n", uniCode:"\u2614"},
    {openCode:"10n", uniCode:"\u2614"},
    {openCode:"11n", uniCode:"\u26C8"},
    {openCode:"13n", uniCode:"\u2744"},
    {openCode:"50n", uniCode:"\u2602"},
]

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

function weatherIconLookup(lookupCode){
    let returnCode = "";

    for (let i = 0; i < iconLookup.length; i++) {
        if(lookupCode === iconLookup[i].openCode){
            returnCode = iconLookup[i].uniCode;
            return returnCode;
        }
    }
    return returnCode;
}

function renderDetails() {
  let iconCode = weatherIconLookup(weatherObject.icon);

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
    let unicode = "";
 
    // For each forecast card, update its contents based on the forecastArray
    for (let i = 0; i < elementCount; i++) {
        cardHeaderEls[i].textContent = forecastArray[i].forecastDate;

        // loop through all the children
        // query select class card-text within each card
        let cardDetailEls = cardBodyEls[i].querySelectorAll("h5, p");
        for (let j = 0; j < cardDetailEls.length; j++) {

            if(cardDetailEls[j].dataset.id === "High"){
                cardDetailEls[j].textContent = "High: "+forecastArray[i].tempMax+" °F";
            } 
            else if (cardDetailEls[j].dataset.id === "Low"){
                cardDetailEls[j].textContent = "Low: "+forecastArray[i].tempMin+" °F";
            } 
            else if (cardDetailEls[j].dataset.id === "Humidity"){
                cardDetailEls[j].textContent = "Humidity: "+forecastArray[i].humidity+"%";
            } 
            else if (cardDetailEls[j].dataset.id === "Icon"){
                unicode = weatherIconLookup(forecastArray[i].icon);
                cardDetailEls[j].textContent = unicode;
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
        // Get current weather
        //console.log(data);
        let myDate = parseDate(data.current.dt);
  
        weatherObject.weatherDate = myDate;
        weatherObject.icon = data.current.weather[0].icon;
        weatherObject.temp = data.current.temp + " °F";
        weatherObject.humidity = data.current.humidity + "%";
        weatherObject.windSpeed = data.current.wind_speed + " MPH";
  
        weatherObject.uvi = data.current.uvi;

        // Get the forecast
        for (let i = 0; i <= forecastDays; i++) {
    
             myDate = parseDate(data.daily[i].dt);
            
            forecastArray[i] = {forecastDate: myDate,
                                  icon: data.daily[i].weather[0].icon,  
                                  tempMin: data.daily[i].temp.min, 
                                  tempMax: data.daily[i].temp.max,
                                  humidity: data.daily[i].humidity};
        }
 
     // console.log(forecastArray);

      // render city details
      renderDetails();
      renderForecast();
    });
}

function getCurrentWeather(city) {
  let success = true;

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
        success = false;
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
        weatherObject.longitude = data.coord.lon;
        weatherObject.latitude = data.coord.lat;

        // weatherObject.weatherDate = myDate;
        // weatherObject.icon = data.weather[0].icon;
        // weatherObject.temp = data.main.temp + " °F";
        // weatherObject.humidity = data.main.humidity + "%";
        // weatherObject.windSpeed = data.wind.speed + " MPH";
      } else {
        // If the fetch returned an error, set the cityName to the error message
        weatherObject.cityName = data.message;
      }

        if (success) {
            addToCityArray(weatherObject.cityName);
            renderRecentList();
            storeRecentList();
            getForecast();   
        }
      
    });
    
  return;
}

function parseDate(longDate) {
    let myDate = new Date(longDate * 1000);
    myDate = moment(myDate).format("MM/DD/YYYY");

    return myDate;
}


function submitCityName() {
  // If the city named entered is not blank, then continue

  if (inputCityEl.value.trim() !== "") {
      getCurrentWeather(inputCityEl.value.trim());
  }

  // Clear input value on screen
  inputCityEl.value = "";
  inputCityEl.focus();
}

function getClickedCity(event) {
  getCurrentWeather(event.target.textContent);

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
// Use data to set weather icons***

// Use data to set weather icons***
// Create mapping of data icon to emoji***
// Look up emoji***

// 5 Day Forcast
// Use search city to build url for weather service***
// Fetch results from weather service for six days (today and 5 day forecast)***
// Parse results and store in an array of weather objects***
// Populate 5 day forecast***
// Use data- to set weather icons***

// Use search city to build url for UV index***
// Fetch UV index for search city***
// Parse results into variable***
// Add index to details***
// Change UV index background color based on value***

// On click of recent city...***
// Capture city from recent search button***
// Fetch results from weather service ...***
