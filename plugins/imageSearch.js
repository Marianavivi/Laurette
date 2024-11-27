const fetch = require('node-fetch');

module.exports = {
  handleImageSearch: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('image ')) {
      const searchQuery = message.substring(7); // Extract the search query
      try {
        const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&tbm=isch&ijn=0&api_key=YOUR_SERPAPI_API_KEY`); // Replace with your actual API key
        const data = await response.json();
        if (data.images_results && data.images_results.length > 0) {
          const image = data.images_results[0]; // Get the first image result
          await sock.sendMessage(from, { image: { url: image.original } });
        } else {
          await sock.sendMessage(from, { text: 'No images found.' });
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t find any images for that. Try again later!' });
      }
    }
  }
};
