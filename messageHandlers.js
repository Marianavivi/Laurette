const fetch = require('node-fetch');
const config = require('./config');
const { log } = require('./lib/logger'); // Import the logger

// Function to handle incoming messages
const handleMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const message = msg.message.conversation;

  log(`Received message from ${from}: ${message}`); // Log the message

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
    await sock.sendMessage(from, { text: "I'm still learning, but I can do things like greet you, answer simple questions, and maybe even tell you a joke if you ask nicely." });
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
};

module.exports = { handleMessage };
