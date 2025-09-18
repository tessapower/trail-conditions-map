export interface WeatherObservation {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  conditions: string;
  timestamp: string;
}

export interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface HistoricalWeather {
  station: string;
  observations: WeatherObservation[];
  rainfall24h: number;
}
