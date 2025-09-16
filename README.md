# Trail Conditions Map 🚵‍♂️

A full-stack web application that displays an interactive map of mountain biking trails in Austin, combining trail data from TrailForks API with real-time trail conditions from Austin Trail Conditions, enhanced with weather data for intelligent trail warnings.

## 🌟 Features

- **Interactive Trail Map**: Browse mountain biking trails on a detailed map interface
- **Real-Time Conditions**: See current trail conditions (open/closed/muddy) updated automatically
- **Weather Integration**: Current rainfall display with trail warnings based on recent weather
- **Trail Details**: View trail difficulty, length, elevation, and type information
- **Smart Warnings**: AI-powered verification of trail reports using weather history
- **Responsive Design**: Optimized for both desktop and mobile use
- **Efficient Caching**: Smart data updates to minimize API calls and scraping

## 🛠️ Tech Stack

**Frontend:**

- React 18 with TypeScript (Vite)
- Leaflet.js for interactive maps
- React-Leaflet for seamless React integration
- Tailwind CSS for styling

**Backend:**

- Node.js with Express and TypeScript
- Web scraping with Cheerio for fast HTML parsing
- Redis for caching trail and weather data
- PostgreSQL for data persistence

**APIs & Data Sources:**

- TrailForks API for comprehensive trail information
- Austin Trail Conditions (web scraped) for current conditions
- National Weather Service API for weather data and historical rainfall
- OpenStreetMap tiles for trail-friendly mapping

## 🌐 Live Application

### TODO: Update with actual deployed URL

Visit the live application: **[https://trail-conditions-map.railway.app](https://your-deployed-url-here)**

## 💻 Local Development

Want to contribute or run locally? Here's how to set up your dev environment:

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (Docker recommended: `docker run -d -p 6379:6379 redis`)
- TrailForks API key

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/trail-conditions-map.git
   cd trail-conditions-map
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` directory:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/trail_conditions
   REDIS_URL=redis://localhost:6379
   TRAILFORKS_API_KEY=your_api_key_here
   NWS_USER_AGENT=TrailConditionsApp/1.0 (your.email@example.com)
   PORT=3001
   NODE_ENV=development
   ```

4. **Start development servers**

   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory)
   cd ../frontend && npm run dev
   ```

Visit `http://localhost:5173` for the frontend and `http://localhost:3001` for the API.

## 📁 Project Structure

```
trail-conditions-map/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── services/        # Business logic & data fetching
│   │   │   ├── WeatherService.ts      # NWS API integration
│   │   │   ├── TrailForksService.ts   # TrailForks API
│   │   │   └── TrailScraper.ts        # Austin conditions scraping
│   │   ├── models/          # Database models
│   │   ├── utils/           # Helper functions
│   │   └── app.ts           # Express application
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Map/         # Map-related components
│   │   │   ├── Trail/       # Trail display components
│   │   │   └── Weather/     # Weather display components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

- `GET /api/trails` - Get all trails with current conditions
- `GET /api/trails/:id` - Get specific trail details
- `GET /api/conditions` - Get latest trail conditions
- `GET /api/weather/current/:lat/:lon` - Get current weather for location
- `GET /api/weather/history/:lat/:lon` - Get 24-hour weather history
- `POST /api/conditions/refresh` - Force refresh of trail conditions

## 🌤️ Weather Integration

- **Real-time precipitation data** from National Weather Service
- **24-hour rainfall history** for trail condition verification
- **Smart warnings** when trail conditions may have changed due to weather
- **Multiple weather stations** across Austin area for granular data

## 🤖 Future Features

- AI chatbot for trail condition reports
- User authentication and favorite trails
- Community reporting system
- Mobile app version
- Expansion to other Texas cities

## 🤝 Contributing

Contributions are welcome! This project serves the Austin mountain biking community.

**How to contribute:**

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Add new trail areas
   - Improve weather accuracy
   - Enhance mobile experience
   - Fix bugs or add features

4. **Test your changes**

   ```bash
   npm run test        # Run backend tests
   npm run lint        # Check code style
   ```

5. **Commit and push**

   ```bash
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

**Ideas for contributions:**

- Additional Texas cities (San Antonio, Dallas trails)
- User authentication and favorite trails
- Mobile app version
- Trail photo integration
- Community reporting features

**Found a bug?** Please open an issue with details about the trail, browser, and steps to reproduce.

**Have trail data corrections?** We'd love to hear from local riders!

## 📝 License

MIT License - feel free to use this code for your own projects!

## 🙏 Acknowledgments

- [TrailForks](https://www.trailforks.com/) for comprehensive trail data
- [Austin Trail Conditions](https://austintrailconditions.com/) for community-driven updates
- [National Weather Service](https://www.weather.gov/) for reliable weather data
- The Austin mountain biking community for inspiration!

---

**Built with ❤️ for the Austin mountain biking community**
