import { StyleSheet, Text, View } from "react-native";

type Props = {
  uvIndex: number;
};

function getUvLabel(uv: number) {
  if (uv <= 2) return "Faible";
  if (uv <= 5) return "Modéré";
  if (uv <= 7) return "Élevé";
  if (uv <= 10) return "Très élevé";
  return "Extrême";
}

export default function UvIndexCard({ uvIndex }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Indice UV</Text>

      <Text style={styles.value}>{Math.round(uvIndex)}</Text>

      <Text style={styles.label}>{getUvLabel(uvIndex)}</Text>
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
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
  },
  label: {
    color: "#E0F2FE",
    fontSize: 18,
    fontWeight: "700",
  },
});