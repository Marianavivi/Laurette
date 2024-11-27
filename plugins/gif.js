const fetch = require('node-fetch');

module.exports = {
  handleGif: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Respond to keywords with GIFs
    const keywords = ['happy', 'sad', 'funny', 'thank you']; // Add more keywords as needed
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword)) {
        try {
          const response = await fetch(`https://g.tenor.com/v1/search?q=${encodeURIComponent(keyword)}&key=YOUR_API_KEY&limit=1`); // Replace with your actual API key
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const gifUrl = data.results[0].media[0].gif.url;
            await sock.sendMessage(from, { video: { url: gifUrl }, gifPlayback: true });
          }
        } catch (error) {
          console.error('Error sending GIF:', error);
          // You can optionally send an error message to the user
        }
      }
    }
  }
};
