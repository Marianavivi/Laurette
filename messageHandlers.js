const fs = require('fs');
const fetch = require('node-fetch');
const config = require('./config');
const { log } = require('./lib/logger');

// Load user preferences from file
const loadUserPrefs = () => {
  try {
    const data = fs.readFileSync('userPrefs.json');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Save user preferences to file
const saveUserPrefs = (userPrefs) => {
  const data = JSON.stringify(userPrefs);
  fs.writeFileSync('userPrefs.json', data);
};

// Function to handle incoming messages
const handleMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const message = msg.message.conversation;
  const userPrefs = loadUserPrefs();
  const prefix = userPrefs[from] || '/';

  log(`Received message from ${from}: ${message}`);

  // Respond with a custom display name and greeting variations
  if (message.toLowerCase() === 'hello') {
    const greetings = [
      `Hello there! It's ${config.botName} here. How can I help you today?`,
      `Hi! ${config.botName} at your service. What can I do for you?`,
      `Hey! It's ${config.botName}. What's up?`
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    await sock.sendMessage(from, { text: randomGreeting });
  }

  // Respond to "who are you?"
  if (message.toLowerCase().includes('who are you')) {
    await sock.sendMessage(from, { text: `I'm ${config.botName}, your friendly WhatsApp bot. I'm here to help you with whatever you need.` });
  }

  // Respond to "what can you do?"
  if (message.toLowerCase().includes('what can you do')) {
    await sock.sendMessage(from, { text: "I'm still learning, but I can do things like greet you, answer simple questions, and provide information." });
  }

  // Respond to "time"
  if (message.toLowerCase() === 'time') {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await sock.sendMessage(from, { text: `The current time is ${timeString}` });
  }

  // Respond to "cat" by sending a cat image
  if (message.toLowerCase() === 'cat') {
    await sock.sendMessage(from, {
      image: { url: 'https://cataas.com/cat' } 
    });
  }

  // Respond to "fun fact"
  if (message.toLowerCase() === 'fun fact') {
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
      const data = await response.json();
      await sock.sendMessage(from, { text: data.text });
    } catch (error) {
      console.error('Error fetching fun fact:', error);
      await sock.sendMessage(from, { text: 'Oops, I couldn\'t find a fun fact right now. Try again later!' });
    }
  }

  // Respond to "news"
  if (message.toLowerCase() === 'news') {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`); // Replace with your actual API key
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        const newsItem = data.articles[0]; // Get the first news item
        const newsMessage = `*${newsItem.title}*\n${newsItem.description}\n${newsItem.url}`;
        await sock.sendMessage(from, { text: newsMessage });
      } else {
        await sock.sendMessage(from, { text: 'No news found.' });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      await sock.sendMessage(from, { text: 'Oops, I couldn\'t fetch the news right now. Try again later!' });
    }
  }

  // Respond to commands
  if (message.startsWith(prefix)) {
    const command = message.substring(prefix.length).toLowerCase();
    switch (command) {
      case 'hello':
        await sock.sendMessage(from, { text: `Hello! I'm ${config.botName}.` });
        break;
      case 'time':
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await sock.sendMessage(from, { text: `The current time is ${timeString}` });
        break;
      case 'cat':
        await sock.sendMessage(from, { image: { url: 'https://cataas.com/cat' } });
        break;
      case 'funfact': // Alias for "fun fact"
      case 'fun fact':
        try {
          const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
          const data = await response.json();
          await sock.sendMessage(from, { text: data.text });
        } catch (error) {
          console.error('Error fetching fun fact:', error);
          await sock.sendMessage(from, { text: 'Oops, I couldn\'t find a fun fact right now. Try again later!' });
        }
        break;
      case 'news':
        try {
          const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`); // Replace with your actual API key
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            const newsItem = data.articles[0]; // Get the first news item
            const newsMessage = `*${newsItem.title}*\n${newsItem.description}\n${newsItem.url}`;
            await sock.sendMessage(from, { text: newsMessage });
          } else {
            await sock.sendMessage(from, { text: 'No news found.' });
          }
        } catch (error) {
          console.error('Error fetching news:', error);
          await sock.sendMessage(from, { text: 'Oops, I couldn\'t fetch the news right now. Try again later!' });
        }
        break;
      case 'setprefix':
        const newPrefix = message.split(' ')[1]; // Get the new prefix from the message
        if (newPrefix) {
          userPrefs[from] = newPrefix;
          saveUserPrefs(userPrefs);
          await sock.sendMessage(from, { text: `Prefix set to "${newPrefix}"` });
        } else {
          await sock.sendMessage(from, { text: 'Please provide a prefix. Example: /setprefix !' });
        }
        break;
      default:
        await sock.sendMessage(from, { text: 'Unknown command. Type /help to see available commands.' });
    }
  }
};

module.exports = { handleMessage };
