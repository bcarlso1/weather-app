
// 1. add icons to default *****
// 2. add city name to results when click
// 3. clickable default

// add popular cities
// add weather forecast with icons
// currently in mobile format
// show weather when click on default city
// handle errors
// say where the place is that is searched
// get default cities in array loop

// hide api key

const weatherList = document.getElementById('weather');
const submit = document.getElementById('submit');
const zip = document.getElementById('zip');

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

    document.getElementById('default-cities').appendChild(div);

    let cityWeather = document.getElementsByClassName("city-weather");

    if (defaultWeatherJSON.weather[0].main === "Clouds"){
        cityWeather[cityWeather.length - 1].classList.add('class', 'fas');
        cityWeather[cityWeather.length - 1].classList.add('class', 'fa-cloud-moon');
    } else {
        cityWeather[cityWeather.length - 1].classList.add('class', 'fas');
        cityWeather[cityWeather.length - 1].classList.add('class', 'fa-snowflake');
    }

}

defaultCities("Boston");
defaultCities("Miami");
defaultCities("New%20York");
defaultCities("Los%20Angeles");
defaultCities("Chicago");
defaultCities("Houston");
defaultCities("Nashville");
defaultCities("San%20Francisco");



async function getZipTemp() {
    let zipValue = zip.value
    zipValue = zipValue.replace(/\/s/g, "%20");
    let url = ""
    if (isNaN(zipValue)) { // if it is not a number
        url = `http://api.openweathermap.org/data/2.5/weather?q=${zipValue}&appid=${apiKey}&units=imperial`;
        console.log('NaN');
    } else {
        url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipValue},us&appid=${apiKey}&units=imperial`;
        console.log('number');
    }
    const weatherResponse = await fetch(url);
    const weatherJSON = await weatherResponse.json();
    console.log(weatherJSON);

    const weatherTemp = weatherJSON.main.temp;
    const weatherFeels = weatherJSON.main.feels_like;
    const tempText = `Today's current temperature is ${Math.round(weatherTemp)}, but it feels like ${Math.round(weatherFeels)}`;

    const weatherHumidity = weatherJSON.main.humidity;
    const humidityText = `Today's humidity was ${weatherHumidity}`;

    const weatherHigh = weatherJSON.main.temp_max;
    const weatherLow = weatherJSON.main.temp_min;
    const lowHighText = `Today's high is ${Math.round(weatherHigh)} and the low is ${Math.round(weatherLow)}`;

    let li1 = document.createElement('li');
    li1.innerHTML = `<b>Current Weather in ${zipValue}</b>`
    weather.appendChild(li1);

    let li = document.createElement('li');
    li.innerHTML = tempText;
    weather.appendChild(li);
    
    let li3 = document.createElement('li');
    li3.innerHTML = lowHighText;
    weather.appendChild(li3);

    let li2 = document.createElement('li');
    li2.innerHTML = humidityText;
    weather.appendChild(li2);

    weatherList.style.backgroundColor = "white";
    weatherList.style.border = "2px black solid";
    
    document.getElementById("weather-detail").style.display = "block";
    document.getElementById('default-cities').style.display = "none";
} 


zip.addEventListener("keyup",  (e) => {
  if(e.keyCode === 13) {
        getZipTemp();  
        weatherList.innerHTML = "";
        zip.value = "";      
    }
}); 