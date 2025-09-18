import axios from 'axios';
import type { WeatherObservation, WeatherStation } from '../types/weather';
import NodeCache from 'node-cache';

export class WeatherService {
  private readonly baseUrl = 'https://api.weather.gov';
  private readonly userAgent =
    'TrailConditionsApp/1.0 (trail-conditions@example.com)';
  private readonly cache = new NodeCache({ stdTTL: 1800 }); // 30 mins

  private readonly austinStations = [
    'KAUS', // Austin-Bergstrom
    'KEDC', // Austin Executive
    'KATT', // Austin Camp Mabry
    'KGTU', // Georgetown Municipal
  ];

  async getCurrentConditions(
    stationId: string
  ): Promise<WeatherObservation | null> {
    const cacheKey = `weather_${stationId}`;
    const cached = this.cache.get<WeatherObservation>(cacheKey);

    if (cached) {
      console.log(`Cache hit for ${stationId}`);
      return cached;
    }

    const result = await this.fetchFromAPI(stationId);

    if (result) {
      this.cache.set(cacheKey, result);
      console.log(`Cache set for ${stationId}`);
    }

    return result;
  }

  private async fetchFromAPI(
    stationId: string
  ): Promise<WeatherObservation | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/stations/${stationId}/observations/latest`,
        {
          headers: { 'User-Agent': this.userAgent },
        }
      );

      const obs = response.data.properties;
      return {
        temperature: obs.temperature?.value || 0,
        humidity: obs.relativeHumidity?.value || 0,
        windSpeed: obs.windSpeed?.value || 0,
        precipitation: obs.precipitationLastHour?.value || 0,
        conditions: obs.textDescription || 'Unknown',
        timestamp: obs.timestamp,
      };
    } catch (error) {
      console.error(`Error fetching conditions for ${stationId}:`, error);
      return null;
    }
  }

  async getNearbyStations(lat: number, lon: number): Promise<WeatherStation[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/points/${lat},${lon}/stations`,
        {
          headers: { 'User-Agent': this.userAgent },
        }
      );

      return response.data.features.map((station: any) => ({
        id: station.properties.stationIdentifier,
        name: station.properties.name,
        lat: station.geometry.coordinates[1],
        lon: station.geometry.coordinates[0],
      }));
    } catch (error) {
      console.error('Error fetching weather stations:', error);
      return [];
    }
  }

  async getAustinAreaWeather(): Promise<WeatherObservation[]> {
    const observations = await Promise.allSettled(
      this.austinStations.map((station) => this.getCurrentConditions(station))
    );

    observations.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.log(
          `Station ${this.austinStations[index]} failed:`,
          result.reason
        );
      }
    });

    return observations
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null
      )
      .map(
        (result) => (result as PromiseFulfilledResult<WeatherObservation>).value
      );
  }

  async getAverageConditions(): Promise<WeatherObservation | null> {
    const observations = await this.getAustinAreaWeather();
    if (observations.length === 0) return null;

    const avgTemp =
      observations.reduce((sum, obs) => sum + obs.temperature, 0) /
      observations.length;
    const totalRain = observations.reduce(
      (sum, obs) => sum + obs.precipitation,
      0
    );

    return {
      temperature: avgTemp,
      humidity: observations[0]?.humidity || 0, // Use first valid reading
      windSpeed: observations[0]?.windSpeed || 0,
      precipitation: totalRain,
      conditions: observations[0]?.conditions || 'Unknown',
      timestamp: new Date().toISOString(),
    };
  }

  async _getWeatherForTrail(
    lat: number,
    lon: number
  ): Promise<WeatherObservation | null> {
    const stations = await this.getNearbyStations(lat, lon);
    if (stations.length === 0) return this.getAverageConditions();

    return this.getCurrentConditions(stations[0]?.id || '');
  }
}
