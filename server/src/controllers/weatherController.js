// Mock weather API
exports.getWeather = (req, res) => {
  const { location } = req.query;
  const mockWeather = {
    location: location || 'Default Region',
    temperature: Math.floor(Math.random() * 15) + 20,
    humidity: Math.floor(Math.random() * 40) + 40,
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'][Math.floor(Math.random() * 5)],
    windSpeed: Math.floor(Math.random() * 20) + 5,
    forecast: [
      { day: 'Mon', temp: 28, condition: 'Sunny' },
      { day: 'Tue', temp: 26, condition: 'Cloudy' },
      { day: 'Wed', temp: 30, condition: 'Clear' },
      { day: 'Thu', temp: 24, condition: 'Light Rain' },
      { day: 'Fri', temp: 27, condition: 'Partly Cloudy' },
    ],
    advisory: 'Good conditions for irrigation. Monitor soil moisture levels.',
  };
  res.json(mockWeather);
};
