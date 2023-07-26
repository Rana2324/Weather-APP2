function getId(selector) {
  return document.querySelector(selector);
}

const key = "3371667f69747b7e6e308b2c4b826f83";

let weatherInfo = {};

// getting permission for location to user and by the location fetching data through API
if (window.navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //   console.log(position);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
      fetchData(uri);
    },
    (error) => {
      const uri = `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${key}`;
      fetchData(uri);
      console.log(error);
    }
  );
}

// API Fetching Function
function fetchData(uri) {
  fetch(uri)
    .then((res) => res.json())
    .then((data) =>
      // (weatherInfo = data)
      {
        const conditionIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const cityAndCountry = data.name + ", " + data.sys.country;
        const weatherCondition = data.weather[0].main;
        const temp = data.main.temp - 273.15;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        weatherInfo = {
          conditionIcon,
          cityAndCountry,
          weatherCondition,
          temp,
          pressure,
          humidity,
        };

        // reset data to ui
        const histories = document.querySelectorAll(".history");

        const historyData = getDataFromLocalStorage();

        if (historyData.length === 4) {
          histories[3].remove();
          historyData.pop();
          historyData.unshift(weatherInfo);
        } else {
          historyData.unshift(weatherInfo);
        }
        getId(".historyList").insertAdjacentElement(
          "afterbegin",
          historyDataInnerHTML(weatherInfo)
        );

        // set data to local storage
        localStorage.setItem("weather", JSON.stringify(historyData));
      }
    )
    .catch((error) => {
      alert("Enter valid city name.........!");
      console.log(error);
    })
    .finally(() => {
      displayData(weatherInfo);
    });
}

// Display Data Function
function displayData({
  conditionIcon,
  cityAndCountry,
  weatherCondition,
  temp,
  pressure,
  humidity,
}) {
  getId("#condition_img").src = conditionIcon;
  getId("#cityName").innerHTML = cityAndCountry;
  getId("#condition").innerHTML = weatherCondition;
  getId(".temp").innerHTML = temp.toFixed(2);
  getId(".pressure").innerHTML = pressure;
  getId(".humidity").innerHTML = humidity;
}

// getting data on enter keypress from search button
getId("#searchBtn").addEventListener("click", function () {
  const cityName = getId("#search_inp").value;
  if (!cityName) {
    return alert("Enter A City Name First......!");
  }
  const uri = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;
  fetchData(uri);
  getId("#search_inp").value = "";
});

// getting data on enter keypress from input field
getId("#search_inp").addEventListener("keypress", function (e) {
  if (e.keyCode === 13) {
    let cityName = getId("#search_inp").value;
    if (!cityName) {
      return alert("Enter A City Name First......!");
    }
    const uri = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;
    fetchData(uri);
    getId("#search_inp").value = "";
  }
});

// get data from local storage
function getDataFromLocalStorage() {
  const data = localStorage.getItem("weather");
  let weather = [];
  if (data) {
    weather = JSON.parse(data);
  }
  return weather;
}

// load data from localStorage
window.onload = function () {
  const historyData = getDataFromLocalStorage();
  historyData.forEach((data) => {
    historyDataInnerHTML(data);
    getId(".historyList").appendChild(historyDataInnerHTML(data));
  });
};

// inner html function of history
function historyDataInnerHTML(data) {
  const div = document.createElement("div");
  div.className = "history";
  div.innerHTML = `
<div>
  <img src=${data.conditionIcon} alt=""/>
  </div>
  <div class="history_info">
      <h3 id="cityName">${data.cityAndCountry}</h3>
      <p id="condition">${data.weatherCondition}</p>
      <div class="weather_details">
      Temp: <span class="temp">${data.temp.toFixed(2)}</span>°C, Pressure: <span
      class="pressure">${
        data.pressure
      }</span>Pa, Humidity: <span class="humidity">${data.humidity}</span>%
      </div>
    </div>`;
  return div;
}

// convert temp
getId("#convertTemp").addEventListener("click", function (e) {
  if (getId(".tempUnit").innerHTML === "°C") {
    const temp = getId(".temp").innerHTML;
    const newValue = (temp * 9) / 5 + 32;
    getId(".temp").innerHTML = newValue.toFixed(2);
    getId(".tempUnit").innerHTML = "°F";
  }else{
    const temp = getId(".temp").innerHTML;
    const newValue = (temp - 32) * 5/9;
    getId(".temp").innerHTML = newValue.toFixed(2);
    getId(".tempUnit").innerHTML = "°C";
  }
});
