import { WeatherData } from "./types";

// PUT YOUR REAL COORDINATES HERE
const LAT = 41.0330;
const LON = -73.7629;

export async function getWeather(): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LAT}` +
    `&longitude=${LON}` +
    `&daily=` +
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "weathercode",
      "sunrise",
      "sunset",
    ].join(",") +
    `&hourly=precipitation_probability` +
    `&temperature_unit=fahrenheit` +
    `&timezone=auto`;

  const res = await fetch(url, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(
      `Failed to fetch weather: ${text}`
    );
  }

  const data = await res.json();

  const daily = data.daily.time.map(
    (date: string, i: number) => {
      // get all hourly precip values for this date

      const hourlyIndices =
        data.hourly.time
          .map((t: string, idx: number) => ({
            t,
            idx,
          }))
          .filter((x: { t: string }) =>
            x.t.startsWith(date)
          )
          .map((x: { idx: number }) => x.idx);

      const precipValues = hourlyIndices.map(
        (idx: number) =>
          data.hourly
            .precipitation_probability[idx]
      );

      const maxPrecip =
        precipValues.length > 0
          ? Math.max(...precipValues)
          : 0;

      return {
        date,

        tempMax: Math.round(
          data.daily.temperature_2m_max[i]
        ),

        tempMin: Math.round(
          data.daily.temperature_2m_min[i]
        ),

        weathercode:
          data.daily.weathercode[i],

        precipitationChance: maxPrecip,
      };
    }
  );

  return {
    daily,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}