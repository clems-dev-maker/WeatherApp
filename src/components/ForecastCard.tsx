import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ForecastItem = {
  dt_txt: string;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
};

type Props = {
  forecast: ForecastItem[];
};

export default function ForecastCard({ forecast }: Props) {
  const dailyForecast = forecast
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  if (dailyForecast.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prévisions 5 jours</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={dailyForecast}
        keyExtractor={(item) => item.dt_txt}
        renderItem={({ item }) => {
          const date = new Date(item.dt_txt.replace(" ", "T"));

          return (
            <View style={styles.dayCard}>
              <Text style={styles.day}>
                {date.toLocaleDateString("fr-FR", {
                  weekday: "short",
                })}
              </Text>

              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={styles.icon}
              />

              <Text style={styles.description} numberOfLines={1}>
                {item.weather[0].description}
              </Text>

              <View style={styles.tempRow}>
                <Text style={styles.tempMin}>
                  Min {Math.round(item.main.temp_min)}°
                </Text>

                <Text style={styles.separator}>|</Text>

                <Text style={styles.tempMax}>
                  Max {Math.round(item.main.temp_max)}°
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: "100%",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  dayCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 22,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    width: 135,
  },

  day: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  icon: {
    width: 64,
    height: 64,
  },

  description: {
    color: "#E0F2FE",
    fontSize: 13,
    textTransform: "capitalize",
    marginBottom: 10,
    maxWidth: 110,
  },

  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  tempMin: {
    color: "#DBEAFE",
    fontSize: 12,
    fontWeight: "600",
  },

  tempMax: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  separator: {
    color: "#BFDBFE",
    marginHorizontal: 6,
  },
});