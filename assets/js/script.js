// Weather Dash

// Globals
let cityArray = [];

// Query Selectors
let btnEl = document.querySelector(".btn");
let userCityEl = document.querySelector(".user-city-name");

// Function calls

// Function definitions
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
}

function readCityName() {
    addToCityArray(userCityEl.value);
}

// Event Listeners
btnEl.addEventListener("click", readCityName);


// On open...
// Populate recent search array from localStorage
// Create and append elements for the recent searches from the recent search array

// On click of search button...
// Capture search city***
// Add searched city to the front of the recent list array if it's not already in the list***
// Create and append elements for the recent searches from the recent search array
// Save recent list array to localStorage
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

// On click of recent city delete...
// Remove clicked city from recent list array
// Create and append elements for the recent searches from the recent search array
// Save recent list array to localStorage
