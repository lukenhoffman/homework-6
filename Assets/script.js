const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Retrieve search history from local storage
let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = input.value;
  getWeather(city);
  console.log(`Searching for city: ${city}`);

  // Add city to search history
  addToSearchHistory(city);
});

function addToSearchHistory(city) {
  // Check if city already exists in search history
  if (!history.includes(city)) {
    // Add city to the beginning of the history array
    history.unshift(city);

    // Limit the history to the 5 most recent searches
    if (history.length > 5) {
      history.pop();
    }

    // Save the updated history to local storage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));

    // Update the search history display
    updateSearchHistory();
  }
}

function updateSearchHistory() {
  searchHistory.innerHTML = '';

  // Create buttons for each city in the history
  history.forEach(city => {
    const searchItem = document.createElement('button');
    searchItem.textContent = city;
    searchItem.addEventListener('click', function () {
      getWeather(city);
      console.log(`Searching for city: ${city}`);
    });
    searchHistory.appendChild(searchItem);
  });
}

function getWeather(city) {
  const apiKey = 'a75514893c944bb3acf01649232306';
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&units=imperial`;

  // Make a GET request to the WeatherAPI
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Extract the necessary data from the API response
      const current = data.current;
      const forecast = data.forecast.forecastday;

      // Update current weather section
      currentWeather.innerHTML = `
        <h2>${city}</h2>
        <p>Date: ${current.date}</p>
        <img src="https:${current.condition.icon}" alt="Weather Icon">
        <p>Temperature: ${current.temp_f}°F</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_mph} mph</p>
      `;

      // Update forecast section
      forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';
      forecast.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
          <p>Date: ${day.date}</p>
          <img src="https:${day.day.condition.icon}" alt="Weather Icon">
          <p>Temperature: ${day.day.avgtemp_f}°F</p>
          <p>Wind Speed: ${day.day.maxwind_mph} mph</p>
          <p>Humidity: ${day.day.avghumidity}%</p>
        `;
        forecastContainer.appendChild(forecastItem);
      });

      // Add city to search history
      addToSearchHistory(city);
    })
    .catch(error => {
      console.log('Error:', error);
      alert('Failed to fetch weather data. Please try again.');
    });
}

// Update search history display on page load
updateSearchHistory();
