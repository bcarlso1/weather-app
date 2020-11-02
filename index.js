
// currently in mobile format- make respnsive
// handle errors
// DRY
// add comments, use github
// hide api key

const uniq = require('uniq')
const dotenv = require('dotenv').config();


const apiKey = process.env.API_KEY;
let apiKeyMap = 'Y6q2cHuhc1zoAqrBHRk7HhHzhAvgxuJs';
const weatherList = document.getElementById('weather');
const submit = document.getElementById('submit');
const zip = document.getElementById('zip');
const weather = document.getElementById('weather');
const cities = ["Boston", "Miami", "New%20York", "Los%20Angeles", "Chicago", "Houston", "Nashville", "San%20Francisco", "Charleston", "Denver"];
let li = "";

// assemble homepage default cities weather
async function defaultCities(city) {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const defaultWeatherResponse = await fetch(url);
    const defaultWeatherJSON = await defaultWeatherResponse.json();
    let div = document.createElement('div');
    div.setAttribute('class', 'default-box')
    city = city.replace(/%20/g, " ");
    div.innerHTML = `<div class="city-name">${city}</div>
                    <div class="city-weather" style='font-size: 64px'></div>
                    <div class="city-temp">${Math.round(defaultWeatherJSON.main.temp)}&#730;</div>`

        
        // pull up current weather detail if click 
        div.addEventListener('click', (e) => {
            zip.value = city;
            weatherDetail();
            zip.value = "";  
        })
        document.getElementById('default-cities').appendChild(div);

    let cityWeather = document.getElementsByClassName("city-weather");
    function cityWeatherClass(className) {
        cityWeather[cityWeather.length - 1].classList.add('class', `${className}`);
    }

    cityWeatherClass('fas');
    if (defaultWeatherJSON.weather[0].main === "Clouds"){
        cityWeatherClass('fa-cloud-moon');
    } else if (defaultWeatherJSON.weather[0].main === "Clear") {
        cityWeatherClass('fa-sun');
    } else if (defaultWeatherJSON.weather[0].main === "Rain") {
        cityWeatherClass('fa-cloud-rain');
    } else {
        cityWeatherClass('fa-meteor');
        console.log(defaultWeatherJSON.weather[0].main)
    }

}

// add cities to homepage
async function loadCities() {
    for (var i = 0; i < cities.length; i++) {
        defaultCities(cities[i]);
    }
}

loadCities();


// function for creating and appending LI elements to DOM
function addLI(parent, text) {
    li = document.createElement('li');
    li.innerHTML = text;
    parent.appendChild(li);
}

// get weather detail
async function weatherDetail() {
  // turn city or zip into lat/long to meet API reqs
  let zipValue = zip.value
  zipValue = zipValue.replace(/\/s/g, "%20");
  let url = `http://open.mapquestapi.com/geocoding/v1/address?key=${apiKeyMap}&location=${zipValue}`;
  const latLongResponse = await fetch(url);
  const latLongJSON = await latLongResponse.json();
  let lat = latLongJSON.results[0].locations[0].latLng.lat.toFixed(4);
  let lng = latLongJSON.results[0].locations[0].latLng.lng.toFixed(4);
  // use lat/long to access weather API
  url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&&appid=${apiKey}&units=imperial`;
  const weatherResponse = await fetch(url2);
  const weatherJSON = await weatherResponse.json();
  console.log(weatherJSON);

    // CURRENT WEATHER DETAIL
  
    const tempText = `${Math.round(weatherJSON.current.temp)}&#730; (Feels like ${Math.round(weatherJSON.current.feels_like)}&#730;)`;

    const weatherHumidity = weatherJSON.current.humidity;
    const humidityText = `Humidity: ${weatherHumidity}%`;

    addLI(weather, `<h2>${zipValue}</h2>`);

    let cloudsOrNot = weatherJSON.current.weather[0].main
    li = document.createElement('li');
    li.classList.add('fas');
    if (cloudsOrNot === "Clouds"){
        li.classList.add('fa-cloud-moon');
    } else if (cloudsOrNot === "Clear") {
        li.classList.add('fa-sun');
    } else if (cloudsOrNot === "Rain") {
        li.classList.add('fa-cloud-rain');
    } else {
        li.classList.add('fa-meteor');
      //  console.log(defaultWeatherJSON.weather[0].main)
    }
    weather.appendChild(li);

    addLI(weather, cloudsOrNot);
    addLI(weather, tempText);
    addLI(weather, humidityText);

    
    // FORECAST 
    
    // GET DAY OF WEEK
    let today = new Date().getDay(); 
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let forecast = document.getElementById('forecast');


    let cloudsOrNot2 = "";
    let day = "";

     // day can't be 8
    for (var i = 1; i < 5; i++) {
        if((today + i) > 7) {
            today = today - 7;
            console.log('hey');
        }

    // cloudsOrNot2 = weatherJSON.daily[1].weather[0].main;
     li = document.createElement('li');
     li.classList.add('day-forecast');

    //     li.classList.add('fas');
    //     if (cloudsOrNot2 === "Clouds"){
    //         li.classList.add('fa-cloud-moon');
    //     } else if (cloudsOrNot2 === "Clear") {
    //         li.classList.add('fa-sun');
    //     } else if (cloudsOrNot2 === "Rain") {
    //         li.classList.add('fa-cloud-rain');
    //     } else {
    //         li.classList.add('fa-meteor');
    //     }
    
    li.innerHTML = `<div class="day">${daysOfWeek[(today + i)]}</div>
        <div class="hi-lo">${weatherJSON.daily[1].weather[0].main}</div>
        <div class="hi-lo"> high:${Math.round(weatherJSON.daily[1].temp.max)} | low:${Math.round(weatherJSON.daily[1].temp.min)}</div>
        <hr>`;
    
    forecast.appendChild(li);
     
    }

    
    document.getElementById("weather-detail").style.display = "block";
    document.getElementById('default-cities').style.display = "none";
} 


zip.addEventListener("keyup",  (e) => {
  if(e.keyCode === 13) {
        forecast.innerHTML = "";
        weatherDetail();  
        weatherList.innerHTML = "";
        zip.value = "";      
    }
}); 

document.getElementById('forecast-tab').addEventListener('click', (e) => {
    document.getElementById('current').style.display = "none";
    document.getElementById('forecast').style.display = "block";
    document.getElementById('forecast-tab').style.borderBottom = "navy sold 5px";
    document.getElementById('current-tab').style.borderBottom = "5px solid #7FFFD4;";
});

document.getElementById('current-tab').addEventListener('click', (e) => {
    document.getElementById('forecast').style.display = "none";
    document.getElementById('current').style.display = "block";
    document.getElementById('current-tab').style.borderBottom = "navy solid 5px";
    document.getElementById('forecast-tab').style.borderBottom = "5px solid #7FFFD4";
});

document.getElementsByTagName('h1')[0].addEventListener('click', (e) => {
    location.reload();
})
