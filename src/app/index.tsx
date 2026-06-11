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

import {
  getWeatherByCity,
  getWeatherByCoords,
  getForecastByCity,
} from "../services/weatherApi";

import { getWeatherGradient } from "../utils/weatherTheme";

const FAVORITES_STORAGE_KEY = "favorite_cities";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedFavorites =
          await AsyncStorage.getItem(
            FAVORITES_STORAGE_KEY
          );

        if (storedFavorites) {
          setFavorites(
            JSON.parse(storedFavorites)
          );
        }

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          const weatherData =
            await getWeatherByCity("Paris");

          const forecastData =
            await getForecastByCity("Paris");

          setWeather(weatherData);
          setForecast(forecastData.list);

          return;
        }

        const location =
          await Location.getCurrentPositionAsync({});

        const weatherData =
          await getWeatherByCoords(
            location.coords.latitude,
            location.coords.longitude
          );

        const forecastData =
          await getForecastByCity(
            weatherData.name
          );

        setWeather(weatherData);
        setForecast(forecastData.list);
      } catch (error) {
        console.error(error);

        try {
          const weatherData =
            await getWeatherByCity("Paris");

          const forecastData =
            await getForecastByCity("Paris");

          setWeather(weatherData);
          setForecast(forecastData.list);
        } catch (fallbackError) {
          console.error(fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const saveFavorites = async (
    newFavorites: string[]
  ) => {
    setFavorites(newFavorites);

    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(newFavorites)
    );
  };

  const addFavoriteCity = async () => {
    if (!weather?.name) return;

    const cityName = weather.name;

    if (favorites.includes(cityName)) {
      return;
    }

    const newFavorites = [
      ...favorites,
      cityName,
    ];

    await saveFavorites(newFavorites);
  };

  const removeFavoriteCity = async (
    cityName: string
  ) => {
    const newFavorites =
      favorites.filter(
        (city) => city !== cityName
      );

    await saveFavorites(newFavorites);
  };

  const selectFavoriteCity = async (
    cityName: string
  ) => {
    try {
      setError("");

      const weatherData =
        await getWeatherByCity(cityName);

      const forecastData =
        await getForecastByCity(cityName);

      setWeather(weatherData);
      setForecast(forecastData.list);
    } catch (error) {
      setError(
        "Impossible de charger cette ville."
      );
    }
  };

  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");

      const weatherData =
        await getWeatherByCity(city);

      const forecastData =
        await getForecastByCity(city);

      setWeather(weatherData);
      setForecast(forecastData.list);

      setCity("");
    } catch (error) {
      console.error(error);

      setError(
        "Ville introuvable"
      );
    }
  };

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
        <Text>
          Impossible de récupérer la météo.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        getWeatherGradient(
          weather.weather[0].main
        ) as [string, string]
      }
      style={{
        flex: 1,
      }}
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
            }}
          >
            {error}
          </Text>
        ) : null}

        <FavoriteCities
          favorites={favorites}
          onSelectCity={
            selectFavoriteCity
          }
          onRemoveCity={
            removeFavoriteCity
          }
        />

        <Pressable
          onPress={addFavoriteCity}
          style={{
            backgroundColor:
              "rgba(255,255,255,0.2)",
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
            ⭐ Ajouter {weather.name}
            {" "}aux favoris
          </Text>
        </Pressable>

        <WeatherCard
          city={weather.name}
          temperature={weather.main.temp}
          description={
            weather.weather[0].description
          }
          icon={
            weather.weather[0].icon
          }
          feelsLike={
            weather.main.feels_like
          }
          humidity={
            weather.main.humidity
          }
          windSpeed={
            weather.wind.speed
          }
          tempMin={
            weather.main.temp_min
          }
          tempMax={
            weather.main.temp_max
          }
          sunrise={
            weather.sys.sunrise
          }
          sunset={
            weather.sys.sunset
          }
        />

        <ForecastCard
          forecast={forecast}
        />
      </ScrollView>
    </LinearGradient>
  );
}

