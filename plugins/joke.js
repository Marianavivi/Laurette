const fetch = require('node-fetch');

module.exports = {
  handleJoke: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase() === 'joke') {
      try {
        const response = await fetch('https://icanhazdadjoke.com/', {
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        await sock.sendMessage(from, { text: data.joke });
      } catch (error) {
        console.error('Error fetching joke:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t find a joke right now. Try again later!' });
      }
    }
  }
};
