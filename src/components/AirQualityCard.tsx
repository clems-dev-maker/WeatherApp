import { StyleSheet, Text, View } from "react-native";

type Props = {
  aqi: number;
  pm25: number;
  pm10: number;
};

function getAqiLabel(aqi: number) {
  switch (aqi) {
    case 1:
      return "Bonne";
    case 2:
      return "Correcte";
    case 3:
      return "Modérée";
    case 4:
      return "Mauvaise";
    case 5:
      return "Très mauvaise";
    default:
      return "Inconnue";
  }
}

export default function AirQualityCard({ aqi, pm25, pm10 }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Qualité de l'air</Text>

      <Text style={styles.mainValue}>{getAqiLabel(aqi)}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>PM2.5</Text>
        <Text style={styles.value}>{Math.round(pm25)} µg/m³</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>PM10</Text>
        <Text style={styles.value}>{Math.round(pm10)} µg/m³</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  mainValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    color: "#E0F2FE",
    fontSize: 16,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});