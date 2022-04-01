var cityFormEl = document.querySelector('#city-form');
var searchHistoryButtonsEl = document.querySelector('#searchHistory-buttons');
var nameInputEl = document.querySelector('#searchCity');
var fiveDayWeatherEl = document.querySelector('#fiveDayWeather');
var cityAndDateEl = document.querySelector('#cityWeather');
var currentTemp = document.querySelector('#tempResult');
var currentWind = document.querySelector('#windResult');
var currentHumidity = document.querySelector('#humidityResult');
var currentUvIndex = document.querySelector('#uvIndexResult');
var currentIconEl = document.querySelector('#currentIcon');
var currentWeatherCard = document.querySelector('#currentWeather');

function renderSearchHist(){
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  console.log(searchHistory);
  if (searchHistory == null){
    return
  }else{
    for (let i=0; i<searchHistory.length; i++){

    let searchButton = document.createElement("button");
    searchButton.classList = 'btn';

    let toUpperCase = searchHistory[i].city.toUpperCase();
    searchButton.setAttribute('data-id', toUpperCase);
    searchButton.textContent = toUpperCase;
    searchHistoryButtonsEl.appendChild(searchButton);

    }
  }
}


var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityToSearch = nameInputEl.value.trim();

    if (cityToSearch) {
      getCityCord(cityToSearch);

      fiveDayWeatherEl.textContent = '';
      nameInputEl.value = '';
    } else {
      alert('Please enter a U.S. city');
    }
  //setting to local storage
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  let searchedCity = {
    city: cityToSearch,
  };
  
  searchHistory.push(searchedCity);

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory))

  console.log(searchHistory);

};

var buttonClickHandler = function (event) {
  var cityHistory = event.target.getAttribute('data-id');
  console.log(cityHistory)

  if (cityHistory) {
    // get lat and long from history
    fiveDayWeatherEl.textContent = '';
    getCityCord(cityHistory)

    
  }
};

var getCityCord = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=54e7f52687ad06a72df0a38da00d54f8&units=imperial';
  var dateObject;
  var dateMonth;
  var dateDay;
  var dateYear;
  var searchDate;
  var currentIconCode;
  var currentIconDscrpt;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {

          cityAndDateEl.textContent = "";
          dateObject = new Date((data.dt)*1000);
          dateMonth = dateObject.toLocaleDateString("en-US", {month: "long"});
          dateDay = dateObject.toLocaleDateString("en-US", {day: "numeric"});
          dateYear = dateObject.toLocaleDateString("en-US", {year: "numeric"});
          searchDate = dateMonth+'.'+dateDay+'.'+dateYear;

          cityAndDateEl.textContent = data.name+' ('+searchDate+')';
          
          currentIconCode = data.weather[0].icon;
          currentIconDscrpt = data.weather[0].description;
          currentIconEl.setAttribute('src','http://openweathermap.org/img/wn/'+currentIconCode+'@2x.png')
          currentIconEl.setAttribute('alt', currentIconDscrpt)
          currentIconEl.setAttribute('style','width: 50px; height: 50px; background-color: var(--light-dark); border-radius: var(--border-radius)')
          currentWeatherCard.setAttribute('style','background-color: white;)')
      
          var lat = data.coord.lat;
          var lon = data.coord.lon;
          getCityWeather(lat, lon);

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getCityWeather = function (lat, lon) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon='+lon+'&appid=54e7f52687ad06a72df0a38da00d54f8&units=imperial';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
                
        currentTemp.textContent = ' '+Math.floor(data.current.temp)+ '&#8457;';
        currentWind.textContent = ' '+data.current.wind_speed+' MPH';
        currentHumidity.textContent = ' '+data.current.humidity+' %';
        currentUvIndex.textContent = ' '+data.current.uvi;
        
          if(data.current.uvi<=2) {
            currentUvIndex.setAttribute('style','background-color: green; color: white; border-radius: var(--border-radius); padding-right: 5px')
          }else if(data.current.uvi<=5) {
            currentUvIndex.setAttribute('style','background-color: yellow; border-radius: var(--border-radius); padding-right: 5px')
          }else if(data.current.uvi<=7) {
            currentUvIndex.setAttribute('style','background-color: orange; border-radius: var(--border-radius); padding-right: 5px')
          }else if(data.current.uvi<=10) {
            currentUvIndex.setAttribute('style','background-color: red; color: white; border-radius: var(--border-radius); padding-right: 5px')
          }else {
            currentUvIndex.setAttribute('style','background-color: purple; color: white; border-radius: var(--border-radius); padding-right: 5px')
          }

        display5dayWeather(data.daily);
      
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var display5dayWeather = function (data5Day) {
  if (data5Day.length === 0) {
    fiveDayWeatherEl.textContent = 'No repositories found.';
    return;
  };

  for (var i = 1; i < 6; i++) {
    // var repoDay = repos[i].owner.login + '/' + repos[i].name;


    var weatherDayCard = document.createElement('div');
    var weatherCardH2 = document.createElement('h2');
    var weatherIcon = document.createElement('img')
    var weatherInfoGroup = document.createElement('div');
    var pTemp = document.createElement('p');
    var pWind = document.createElement('p');
    var pHumidity = document.createElement('p');

    let dateObject = new Date((data5Day[i].dt)*1000);
    let dateMonth = dateObject.toLocaleDateString("en-US", {month: "long"});
    let dateDay = dateObject.toLocaleDateString("en-US", {day: "numeric"});
    let dateYear = dateObject.toLocaleDateString("en-US", {year: "numeric"});
    let dateEl = dateMonth+'.'+dateDay+'.'+dateYear;

    let iconEl = data5Day[i].weather[0].icon
    let iconDscrpt = data5Day[i].weather[0].description;

    pTemp.textContent = 'Temp: '+Math.floor(data5Day[i].temp.day)+' F';
    pWind.textContent =  'Wind: '+data5Day[i].wind_speed+' MPH';
    pHumidity.textContent = 'Humidity: '+data5Day[i].humidity+' %';

    pTemp.setAttribute('style','margin: 0; font-size: 1rem')
    pWind.setAttribute('style','margin: 0; font-size: 1rem')
    pHumidity.setAttribute('style','margin: 0; font-size: 1rem')

    weatherIcon.setAttribute('src','http://openweathermap.org/img/wn/'+iconEl+'@2x.png');
    weatherIcon.setAttribute('alt', iconDscrpt);
    weatherIcon.setAttribute('style','width: 50px; height: 50px; border-radius: var(--border-radius)')

    weatherCardH2.textContent = dateEl;
    weatherCardH2.setAttribute('style', 'color: white; font-weight: 250; font-size: 1rem')

    weatherDayCard.classList = 'col-12 col-lg-2';
    weatherDayCard.setAttribute('style','background-color: var(--light-dark); color: white; border-radius: var(--border-radius); padding: 5px; margin-bottom: 5px')



    weatherInfoGroup.appendChild(pTemp);
    weatherInfoGroup.appendChild(pWind);
    weatherInfoGroup.appendChild(pHumidity);

    weatherDayCard.appendChild(weatherCardH2);
    weatherDayCard.appendChild(weatherIcon);
    weatherDayCard.appendChild(weatherInfoGroup);

    fiveDayWeatherEl.appendChild(weatherDayCard);

    // var titleEl = document.createElement('span');
    // titleEl.textContent = repoName;

    // repoEl.appendChild(titleEl);

    // var statusEl = document.createElement('span');
    // statusEl.classList = 'flex-row align-center';

    // if (repos[i].open_issues_count > 0) {
    //   statusEl.innerHTML =
    //     "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    // } else {
    //   statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    // }

    // repoEl.appendChild(statusEl);

    // fiveDayWeatherEl.appendChild(repoEl);
  }
};

renderSearchHist();

cityFormEl.addEventListener('submit', formSubmitHandler);
searchHistoryButtonsEl.addEventListener('click', buttonClickHandler);
