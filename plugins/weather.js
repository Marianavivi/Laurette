const fetch = require('node-fetch');

module.exports = {
  handleWeather: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('weather ')) {
      const location = message.substring(8); // Extract the location
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=YOUR_API_KEY&units=metric`); // Replace with your actual API key
        const data = await response.json();
        if (data.cod === 200) {
          const weatherDescription = data.weather[0].description;
          const temperature = data.main.temp;
          const feelsLike = data.main.feels_like;
          const humidity = data.main.humidity;
          const weatherMessage = `The weather in ${data.name} is ${weatherDescription}.\nThe temperature is ${temperature}°C, but it feels like ${feelsLike}°C.\nThe humidity is ${humidity}%.`;
          await sock.sendMessage(from, { text: weatherMessage });
        } else {
          await sock.sendMessage(from, { text: 'City not found.' });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t fetch the weather. Try again later!' });
      }
    }
  }
};
