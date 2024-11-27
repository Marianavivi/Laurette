const fetch = require('node-fetch');

module.exports = {
  handleDictionary: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Respond to "define" command
    if (message.toLowerCase().startsWith('define ')) {
      const word = message.substring(7); // Extract the word
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const definition = data[0].meanings[0].definitions[0].definition;
          await sock.sendMessage(from, { text: `*${word}:*\n${definition}` });
        } else {
          await sock.sendMessage(from, { text: 'Word not found.' });
        }
      } catch (error) {
        console.error('Error fetching definition:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t find a definition for that word. Try again later!' });
      }
    }
  }
};
