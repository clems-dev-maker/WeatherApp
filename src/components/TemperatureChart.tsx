import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

type ForecastItem = {
  dt_txt: string;
  main: {
    temp: number;
  };
};

type Props = {
  forecast: ForecastItem[];
};

export default function TemperatureChart({ forecast }: Props) {
  const dailyForecast = forecast
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  if (dailyForecast.length === 0) {
    return null;
  }

  const temperatures = dailyForecast.map((item) => Math.round(item.main.temp));

  const labels = dailyForecast.map((item) => {
    const date = new Date(item.dt_txt.replace(" ", "T"));
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
    });
  });

  const width = Dimensions.get("window").width - 40;
  const height = 220;
  const padding = 35;

  const minTemp = Math.min(...temperatures) - 2;
  const maxTemp = Math.max(...temperatures) + 2;

  const getX = (index: number) =>
    padding + (index * (width - padding * 2)) / (temperatures.length - 1);

  const getY = (temp: number) =>
    height -
    padding -
    ((temp - minTemp) / (maxTemp - minTemp)) * (height - padding * 2);

  const points = temperatures
    .map((temp, index) => `${getX(index)},${getY(temp)}`)
    .join(" ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Évolution des températures</Text>

      <View style={styles.chartContainer}>
        <Svg width={width} height={height}>
          {[0, 1, 2, 3].map((line) => {
            const y = padding + line * 40;

            return (
              <Line
                key={line}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
            );
          })}

          <Polyline
            points={points}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {temperatures.map((temp, index) => (
            <Circle
              key={index}
              cx={getX(index)}
              cy={getY(temp)}
              r="6"
              fill="#FFFFFF"
            />
          ))}

          {temperatures.map((temp, index) => (
            <SvgText
              key={`temp-${index}`}
              x={getX(index)}
              y={getY(temp) - 14}
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
            >
              {temp}°
            </SvgText>
          ))}

          {labels.map((label, index) => (
            <SvgText
              key={`label-${index}`}
              x={getX(index)}
              y={height - 10}
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  chartContainer: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
});