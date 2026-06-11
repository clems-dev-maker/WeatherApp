export const getWeatherGradient = (
  weatherMain: string
): [string, string] => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return ["#4FACFE", "#00F2FE"];

    case "clouds":
      return ["#757F9A", "#D7DDE8"];

    case "rain":
      return ["#314755", "#26A0DA"];

    case "thunderstorm":
      return ["#141E30", "#243B55"];

    case "snow":
      return ["#E6DADA", "#274046"];

    default:
      return ["#0F172A", "#1E293B"];
  }
};

