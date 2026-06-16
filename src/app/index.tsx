import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import SearchBar from "../components/SearchBar";
import FavoriteCities from "../components/FavoriteCities";
import SearchHistory from "../components/SearchHistory";
import TemperatureChart from "../components/TemperatureChart";
import { useColorScheme } from "react-native";
import AirQualityCard from "../components/AirQualityCard";
import UvIndexCard from "../components/UvIndexCard";

import {
  getAirPollutionByCoords,
  getUvIndexByCoords,
} from "../services/weatherApi";

import {
  getWeatherByCity,
  getWeatherByCoords,
  getForecastByCity,
} from "../services/weatherApi";

import { getWeatherGradient } from "../utils/weatherTheme";

const FAVORITES_STORAGE_KEY = "favorite_cities";
const HISTORY_STORAGE_KEY = "search_history";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [airQuality, setAirQuality] = useState<any>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY
        );

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        const storedHistory = await AsyncStorage.getItem(
          HISTORY_STORAGE_KEY
        );

        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory));
        }

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          const weatherData = await getWeatherByCity("Paris");
          const forecastData = await getForecastByCity("Paris");

          setWeather(weatherData);
          setForecast(forecastData.list);

          await loadEnvironmentalData(
            weatherData.coord.lat,
            weatherData.coord.lon,
          );

          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        const weatherData = await getWeatherByCoords(
          location.coords.latitude,
          location.coords.longitude
        );

        const forecastData = await getForecastByCity(weatherData.name);

        setWeather(weatherData);
        setForecast(forecastData.list);
      } catch (error) {
        console.error(error);

        try {
          const weatherData = await getWeatherByCity("Paris");
          const forecastData = await getForecastByCity("Paris");

          setWeather(weatherData);
          setForecast(forecastData.list);

          await loadEnvironmentalData(
            weatherData.coord.lat,
            weatherData.coord.lon,
          );
        } catch (fallbackError) {
          console.error(fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const saveFavorites = async (newFavorites: string[]) => {
    setFavorites(newFavorites);

    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(newFavorites)
    );
  };

  const saveSearchHistory = async (cityName: string) => {
    const cleanedCity = cityName.trim();

    if (!cleanedCity) return;

    const newHistory = [
      cleanedCity,
      ...searchHistory.filter((item) => item !== cleanedCity),
    ].slice(0, 5);

    setSearchHistory(newHistory);

    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(newHistory)
    );
  };

  const clearSearchHistory = async () => {
    setSearchHistory([]);

    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const addFavoriteCity = async () => {
    if (!weather?.name) return;

    const cityName = weather.name;

    if (favorites.includes(cityName)) {
      return;
    }

    const newFavorites = [...favorites, cityName];

    await saveFavorites(newFavorites);
  };

  const removeFavoriteCity = async (cityName: string) => {
    const newFavorites = favorites.filter((city) => city !== cityName);

    await saveFavorites(newFavorites);
  };

  const loadCityWeather = async (cityName: string) => {
    try {
      setError("");

      const weatherData = await getWeatherByCity(cityName);
      const forecastData = await getForecastByCity(cityName);

      setWeather(weatherData);
      setForecast(forecastData.list);

      await loadEnvironmentalData(weatherData.coord.lat, weatherData.coord.lon);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger cette ville.");
    }
  };

  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");

      const weatherData = await getWeatherByCity(city);
      const forecastData = await getForecastByCity(city);

      setWeather(weatherData);
      setForecast(forecastData.list);

      await loadEnvironmentalData(weatherData.coord.lat, weatherData.coord.lon);

      await saveSearchHistory(weatherData.name);

      setCity("");
    } catch (error) {
      console.error(error);

      setError("Ville introuvable");
    }
  };

  const loadEnvironmentalData = async (lat: number, lon: number) => {
  try {
    const airData = await getAirPollutionByCoords(lat, lon);
    setAirQuality(airData.list[0]);


    try {
      const uvData = await getUvIndexByCoords(lat, lon);
      setUvIndex(uvData);
    } catch (uvError) {
      console.log("Indice UV indisponible :", uvError);
      setUvIndex(null);
    }
  } catch (error) {
    console.log("Qualité de l'air indisponible :", error);
  }
};

  const isCurrentCityFavorite = weather
    ? favorites.includes(weather.name)
    : false;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Impossible de récupérer la météo.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode
      ? ["#020617", "#0F172A"]
      : getWeatherGradient(weather.weather[0].main)}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          alignItems: "center",
        }}
      >
        <SearchBar
          value={city}
          onChangeText={setCity}
          onSubmit={searchWeather}
        />

        {error ? (
          <Text
            style={{
              color: "#FFFFFF",
              marginBottom: 15,
              fontWeight: "600",
            }}
          >
            {error}
          </Text>
        ) : null}

        <FavoriteCities
          favorites={favorites}
          onSelectCity={loadCityWeather}
          onRemoveCity={removeFavoriteCity}
        />

        <SearchHistory
          history={searchHistory}
          onSelectCity={loadCityWeather}
          onClearHistory={clearSearchHistory}
        />

        <Pressable
          onPress={addFavoriteCity}
          disabled={isCurrentCityFavorite}
          style={{
            backgroundColor: isCurrentCityFavorite
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.22)",
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 999,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
            }}
          >
            {isCurrentCityFavorite
              ? `⭐ ${weather.name} est déjà dans les favoris`
              : `⭐ ${weather.name} `}
          </Text>
        </Pressable>

        <WeatherCard
          city={weather.name}
          temperature={weather.main.temp}
          description={weather.weather[0].description}
          icon={weather.weather[0].icon}
          feelsLike={weather.main.feels_like}
          humidity={weather.main.humidity}
          windSpeed={weather.wind.speed}
          tempMin={weather.main.temp_min}
          tempMax={weather.main.temp_max}
          sunrise={weather.sys.sunrise}
          sunset={weather.sys.sunset}
        />

        <ForecastCard forecast={forecast} />
        <TemperatureChart forecast={forecast} />

        {airQuality ? (
          <AirQualityCard
            aqi={airQuality.main.aqi}
            pm25={airQuality.components.pm2_5}
            pm10={airQuality.components.pm10}
          />
        ) : null}

        {uvIndex !== null ? <UvIndexCard uvIndex={uvIndex} /> : null}
      </ScrollView>
    </LinearGradient>
  );
}