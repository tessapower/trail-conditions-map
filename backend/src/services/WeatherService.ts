import axios from 'axios';
import type { WeatherObservation } from '../types/weather';
import NodeCache from 'node-cache';

export class WeatherService {
  private readonly baseUrl = 'https://api.weather.gov';
  private readonly userAgent =
    'TrailConditionsApp/1.0 (trail-conditions@example.com)';
  private readonly cache =
    process.env.NODE_ENV === 'development'
      ? new NodeCache({ stdTTL: 1800 }) // 30 mins
      : null;

  private readonly austinStations = [
    'KAUS', // Austin-Bergstrom
    'KEDC', // Austin Executive
    'KATT', // Austin Camp Mabry
    'KGTU', // Georgetown Municipal
  ];

  async getCurrentConditions(
    stationId: string
  ): Promise<WeatherObservation | null> {
    if (this.cache) {
      const cacheKey = `weather_${stationId}`;
      const cached = this.cache.get<WeatherObservation>(cacheKey);

      if (cached) {
        console.log(`Cache hit for ${stationId}`);
        return cached;
      }
    }

    const result = await this.fetchFromAPI(stationId);

    if (result && this.cache) {
      this.cache.set(`weather_${stationId}`, result);
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
}
