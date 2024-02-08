var APIKey = '08214ae72c1f4e9a7c2e2c0daf0568ff' ;
var CityName= document.querySelector('#city');
var WeatherContainer= docurment.querySelector('#weather')
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var city = city.value.trim();
  
    if (city) {
      getUserRepos(city);
  
      WeatherContainer.textContent = '';
      city.value = '';
    } else {
      alert("Please enter a City's name!");
    }
  };

  