export interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
  precipitationChance: number;
}

export interface WeatherData {
  daily: WeatherDay[];
  sunrise: string;
  sunset: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
}