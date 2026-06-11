import { Image, StyleSheet, Text, View } from "react-native";

type WeatherCardProps = {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  tempMin: number;
  tempMax: number;
  sunrise: number;
  sunset: number;
};

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WeatherCard({
  city,
  temperature,
  description,
  icon,
  feelsLike,
  humidity,
  windSpeed,
  tempMin,
  tempMax,
  sunrise,
  sunset,
}: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  
  const windSpeedKmh = Math.round(windSpeed * 3.6);



  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>

      <Text style={styles.date}>
        {new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Text>

      <Image source={{ uri: iconUrl }} style={styles.icon} />

      <Text style={styles.temperature}>
        {Math.round(temperature)}°C
      </Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.minMaxContainer}>
        <Text style={styles.minMaxText}>
          Min {Math.round(tempMin)}°C
        </Text>

        <Text style={styles.minMaxSeparator}>|</Text>

        <Text style={styles.minMaxText}>
          Max {Math.round(tempMax)}°C
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Ressenti</Text>
          <Text style={styles.value}>{Math.round(feelsLike)}°C</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Humidité</Text>
          <Text style={styles.value}>{humidity}%</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Vent</Text>
          <Text style={styles.value}>{windSpeedKmh} km/h</Text>
        </View>
      </View>

      <View style={styles.sunContainer}>
        <View style={styles.sunBox}>
          <Text style={styles.sunIcon}>🌅</Text>
          <Text style={styles.label}>Lever</Text>
          <Text style={styles.value}>{formatTime(sunrise)}</Text>
        </View>

        <View style={styles.sunBox}>
          <Text style={styles.sunIcon}>🌇</Text>
          <Text style={styles.label}>Coucher</Text>
          <Text style={styles.value}>{formatTime(sunset)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "92%",
    padding: 24,
    borderRadius: 30,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  city: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  date: {
    color: "#E0F2FE",
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },

  icon: {
    width: 140,
    height: 140,
  },

  temperature: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  description: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#DBEAFE",
    marginBottom: 12,
  },

  minMaxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  minMaxText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  minMaxSeparator: {
    color: "#BFDBFE",
    marginHorizontal: 10,
  },

  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  detailBox: {
    alignItems: "center",
    flex: 1,
  },

  label: {
    color: "#BFDBFE",
    fontSize: 14,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },

  sunContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },

  sunBox: {
    flex: 1,
    alignItems: "center",
  },

  sunIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
});