
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
      } else {
          console.error('Geocoding error: City not found');
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

