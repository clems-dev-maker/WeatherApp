import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === "web") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("weather-alerts", {
      name: "Alertes météo",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
}

export async function sendWeatherAlert(title: string, body: string) {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
}

export async function checkWeatherAlerts(weather: any, forecast: any[]) {
  const temp = weather.main.temp;
  const windKmh = weather.wind.speed * 3.6;

  if (temp >= 35) {
    await sendWeatherAlert(
      "🌡️ Alerte chaleur",
      `Il fait ${Math.round(temp)}°C à ${weather.name}. Pense à bien t’hydrater.`
    );
  }

  if (temp <= 0) {
    await sendWeatherAlert(
      "❄️ Alerte gel",
      `Risque de gel à ${weather.name}. Température actuelle : ${Math.round(temp)}°C.`
    );
  }

  if (windKmh >= 70) {
    await sendWeatherAlert(
      "💨 Vent fort",
      `Vent fort détecté à ${weather.name} : ${Math.round(windKmh)} km/h.`
    );
  }

  const rainSoon = forecast.some((item) =>
    item.weather?.[0]?.main?.toLowerCase().includes("rain")
  );

  if (rainSoon) {
    await sendWeatherAlert(
      "🌧️ Pluie prévue",
      `De la pluie est prévue prochainement à ${weather.name}.`
    );
  }

  const stormSoon = forecast.some((item) =>
    item.weather?.[0]?.main?.toLowerCase().includes("thunderstorm")
  );

  if (stormSoon) {
    await sendWeatherAlert(
      "⛈️ Orage prévu",
      `Un risque d’orage est prévu à ${weather.name}.`
    );
  }
}