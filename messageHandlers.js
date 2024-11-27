const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const qrcode = require('qrcode-terminal');
const config = require('./config'); // Import configuration settings

// Function to handle incoming messages
const handleMessage = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const message = msg.message.conversation;

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
};

module.exports = { handleMessage };
