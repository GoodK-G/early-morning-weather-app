var APIKey = '08214ae72c1f4e9a7c2e2c0daf0568ff' ;
var CityName= document.querySelector('#city');
var WeatherContainer= document.querySelector('#weather')
var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var city = CityName.value.trim();
  
    if (city) {
      getWeather(city);
  
      WeatherContainer.textContent = '';
      city.value = '';
    } else {
      alert("Please enter a City's name!");
    }
  };

  var get5Day = function (data){
    var apiURL5day = 'http://api.openweathermap.org/data/2.5/forecast?lat='+data.lat + '&lon='+data.lon+'&appid='+ APIKey;
    fetch(apiURL5day)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data)
            });
           
        } else{
           alert('error' + response.statusText);   
        }
        })
        .catch(function (error) {
            alert('Unable to fetch');
        })
  };

  var getWeather = function (city) {
    var apiUrlGeo = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid='+APIKey;
    
    fetch(apiUrlGeo)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            get5Day(data);
            console.log(data);
            
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to fetch');
      });
  };
  