const https = require('https');

// WMO weather code → human readable condition
const WMO_CODES = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Severe Thunderstorm',
};

const FARMING_ADVISORY = {
  0: 'Clear skies — ideal for harvesting and field operations.',
  1: 'Good conditions for spraying pesticides and fertilizers.',
  2: 'Suitable for most farm activities. Monitor soil moisture.',
  3: 'Overcast — good for transplanting seedlings to reduce transplant shock.',
  45: 'Foggy conditions — avoid spraying. Check for fungal disease risk.',
  48: 'Icy fog — protect sensitive crops from frost damage.',
  51: 'Light drizzle — delay spraying operations.',
  53: 'Drizzle — avoid field operations. Good for soil moisture.',
  55: 'Heavy drizzle — stay off fields to prevent soil compaction.',
  61: 'Light rain — good for dry crops. Delay harvesting.',
  63: 'Rain — avoid field operations. Check drainage.',
  65: 'Heavy rain — risk of waterlogging. Ensure proper drainage.',
  71: 'Light snow — protect crops with mulching.',
  73: 'Snow — cover sensitive crops. Delay all field operations.',
  75: 'Heavy snow — emergency crop protection needed.',
  80: 'Light showers — monitor for disease. Delay spraying.',
  81: 'Showers — avoid field operations.',
  82: 'Heavy showers — risk of soil erosion. Check drainage channels.',
  95: 'Thunderstorm — stay indoors. Secure farm equipment.',
  96: 'Severe thunderstorm with hail — protect crops immediately.',
  99: 'Severe weather — emergency measures needed for crop protection.',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON response')); }
      });
    }).on('error', reject);
  });
}

exports.getWeather = async (req, res) => {
  const location = req.query.location || 'New Delhi';

  try {
    // Step 1: Geocode city name → lat/lon using Open-Meteo geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoData = await fetchJSON(geoUrl);

    let lat, lon, cityName, country;

    if (geoData.results && geoData.results.length > 0) {
      const place = geoData.results[0];
      lat = place.latitude;
      lon = place.longitude;
      cityName = place.name;
      country = place.country;
    } else {
      // Fallback to New Delhi if location not found
      lat = 28.6139;
      lon = 77.2090;
      cityName = 'New Delhi';
      country = 'India';
    }

    // Step 2: Fetch real weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;
    const weatherData = await fetchJSON(weatherUrl);

    const current = weatherData.current;
    const daily = weatherData.daily;

    const wmoCode = current.weather_code;
    const condition = WMO_CODES[wmoCode] || 'Clear';
    const advisory = FARMING_ADVISORY[wmoCode] || 'Monitor weather conditions before farm operations.';

    // Build 5-day forecast
    const forecast = daily.time.slice(1, 6).map((dateStr, i) => {
      const d = new Date(dateStr);
      return {
        day: DAYS[d.getDay()],
        date: dateStr,
        temp: Math.round((daily.temperature_2m_max[i + 1] + daily.temperature_2m_min[i + 1]) / 2),
        tempMax: Math.round(daily.temperature_2m_max[i + 1]),
        tempMin: Math.round(daily.temperature_2m_min[i + 1]),
        condition: WMO_CODES[daily.weather_code[i + 1]] || 'Clear',
        precipitation: daily.precipitation_sum[i + 1] || 0,
      };
    });

    res.json({
      location: `${cityName}, ${country}`,
      latitude: lat,
      longitude: lon,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      precipitation: current.precipitation || 0,
      condition,
      wmoCode,
      forecast,
      advisory,
      source: 'Open-Meteo (open-meteo.com)',
    });

  } catch (error) {
    console.error('Weather API error:', error.message);
    // Graceful fallback with mock data if API fails
    res.json({
      location: location,
      temperature: 28,
      feelsLike: 30,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Mon', temp: 28, tempMax: 32, tempMin: 24, condition: 'Sunny', precipitation: 0 },
        { day: 'Tue', temp: 26, tempMax: 30, tempMin: 22, condition: 'Cloudy', precipitation: 2 },
        { day: 'Wed', temp: 30, tempMax: 34, tempMin: 26, condition: 'Clear', precipitation: 0 },
        { day: 'Thu', temp: 24, tempMax: 28, tempMin: 20, condition: 'Light Rain', precipitation: 8 },
        { day: 'Fri', temp: 27, tempMax: 31, tempMin: 23, condition: 'Partly Cloudy', precipitation: 1 },
      ],
      advisory: 'Weather data temporarily unavailable. Monitor local conditions.',
      source: 'fallback',
    });
  }
};
