import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeatherByCity = async (city: string) => {
  const response = await axios.get(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
  );

  return response.data;
};

export const getWeatherByCoords = async (
  lat: number,
  lon: number
) => {
  const response = await axios.get(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  );

  return response.data;
};

export const getForecastByCity = async (
  city: string
) => {
  const response = await axios.get(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
  );

  return response.data;
};

export const getAirPollutionByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  return response.data;
};

export const getUvIndexByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}&units=metric&lang=fr`
  );

  return response.data.current.uvi;
};