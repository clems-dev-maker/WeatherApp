import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  history: string[];
  onSelectCity: (city: string) => void;
  onClearHistory: () => void;
};

export default function SearchHistory({
  history,
  onSelectCity,
  onClearHistory,
}: Props) {
  if (history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dernières recherches</Text>

        <Pressable onPress={onClearHistory}>
          <Text style={styles.clear}>Effacer</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={history}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={styles.historyItem}
            onPress={() => onSelectCity(item)}
          >
            <Text style={styles.cityName}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  clear: {
    color: "#E0F2FE",
    fontSize: 14,
    fontWeight: "600",
  },

  historyItem: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
  },

  cityName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});