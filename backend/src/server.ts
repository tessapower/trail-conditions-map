console.log('=== SERVER STARTING ===');

import express from 'express';
import cors from 'cors';
import { WeatherService } from './services/WeatherService';

const app = express();
console.log('App created');

const PORT = process.env.PORT || 3001;

const weatherService = new WeatherService();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Trail Conditions API is running!' });
});

app.get('/api/weather/test', async (_req, res) => {
  try {
    const weather = await weatherService.getAustinAreaWeather();
    res.json(weather);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Weather service failed' });
  }
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
