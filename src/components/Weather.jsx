import React, { useState, useEffect } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": cloud_icon,
    "50n": cloud_icon,
  };

  const search = async (cityName) => {
    if (!cityName) return;

    try {
      // Step 1: Get latitude & longitude
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${import.meta.env.VITE_APP_ID}`;

      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        alert("City not found!");
        return;
      }

      const { lat, lon } = geoData[0];

      // Step 2: Get weather data
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const weatherResponse = await fetch(weatherUrl);
      const data = await weatherResponse.json();

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    search("New York");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(city);
            }
          }}
        />

        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(city)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {weatherData && (
        <>
          <img
            src={weatherData.icon}
            alt="Weather"
            className="weather-icon"
          />

          <p className="temperature">{weatherData.temperature}°C</p>

          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;