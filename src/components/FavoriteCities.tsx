import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  favorites: string[];
  onSelectCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
};

export default function FavoriteCities({
  favorites,
  onSelectCity,
  onRemoveCity,
}: Props) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Villes favorites</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Pressable onPress={() => onSelectCity(item)}>
              <Text style={styles.cityName}>{item}</Text>
            </Pressable>

            <Pressable onPress={() => onRemoveCity(item)}>
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </View>
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

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
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

  remove: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
  },
});

