
document.addEventListener('DOMContentLoaded', () => {
  // Initially fetch weather for a default city or leave it empty
  // to let users input the city themselves.
  fetchWeather();
});

async function fetchWeather() {
  const openWeatherApiKey = '08214ae72c1f4e9a7c2e2c0daf0568ff';
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;

  if (!city) {
      alert('Please enter a city name.');
      return;
  }

  const geocodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${openWeatherApiKey}`;

  try {
      const geocodingResponse = await fetch(geocodingApiUrl);
      const geocodingData = await geocodingResponse.json();

      if (geocodingData.length > 0) {
          const latitude = geocodingData[0].lat;
          const longitude = geocodingData[0].lon;

          const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`;

          const weatherResponse = await fetch(openWeatherApiUrl);
          const weatherData = await weatherResponse.json();
          console.log(weatherData);

          // Handle the fetched data and populate the HTML
          populateWeatherCards(weatherData);

          // Save the search to local storage
          saveSearch(city);
      } else {
          console.error('Geocoding error: City not found');
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

function populateWeatherCards(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecast data

  // Group forecast data by day
  const groupedByDay = groupByDay(data.list);
  console.log(groupedByDay);

  // Loop through the grouped data and create one card per day
  for (const dayData of groupedByDay) {
      // Extract relevant information for the day
      const date = new Date(dayData[0].dt * 1000);
      const temperature = dayData[0].main.temp;
      const description = dayData[0].weather[0].description;
      const card = document.createElement('div');
      const icon = `<img src="http://openweathermap.org/img/wn/${dayData[0].weather[0].icon}.png" alt="${description}">`;

      // Create the HTML content for each card
      card.innerHTML = `
          <h2>${date.toLocaleDateString()}</h2>
          <p>${icon}<p>
          <p>Temperature: ${temperature}°C</p>
          <p>Description: ${description}</p>
      `;

      // Append the card to the forecast container
      forecastContainer.appendChild(card);
  }
}

//I have added the following function to group the forecast data by day

function groupByDay(forecastList) {
  // Create an object to store forecast data grouped by day
  const groupedData = {};

  // Loop through the forecast data
  for (const forecast of forecastList) {
      // Extract the date without the time component
      const date = new Date(forecast.dt * 1000).toLocaleDateString();

      // If the date is not in the grouped data, create an array for that date
      if (!groupedData[date]) {
          groupedData[date] = [];
      }

      // Add the forecast data to the corresponding date
      groupedData[date].push(forecast);
  }

  // Convert the object values to an array
  const result = Object.values(groupedData);

  return result;
}

function saveSearch(city) {
  // Load previous searches from local storage
  const previousSearches = loadPreviousSearches();

  // Add the current search to the array
  previousSearches.unshift(city);

  // Keep only the last 5 searches
  const last5Searches = previousSearches.slice(0, 5);

  // Save the updated array to local storage
  localStorage.setItem('weatherSearches', JSON.stringify(last5Searches));

  // Update the previous searches list in the HTML
  updatePreviousSearches(last5Searches);
}
function updatePreviousSearches(searches) {
  const previousSearchesList = document.getElementById('previous-searches');

  // Clear previous searches
  previousSearchesList.innerHTML = '';

  // Add each search as a list item
  searches.forEach(search => {
      const listItem = document.createElement('li');
      listItem.textContent = search;
      previousSearchesList.appendChild(listItem);

      // Add an event listener to each list item to fetch weather when clicked
       listItem.addEventListener('click', () => {
        // Set the city input value to the clicked search and trigger a new search
        document.getElementById('cityInput').value = search;
        fetchWeather();
      });
  });
}

function loadPreviousSearches() {
  // Retrieve previous searches from local storage
  const previousSearchesJSON = localStorage.getItem('weatherSearches');

  // Parse the JSON data or initialize an empty array if there are no previous searches
  return JSON.parse(previousSearchesJSON) || [];
}