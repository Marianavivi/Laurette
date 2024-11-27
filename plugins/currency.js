const fetch = require('node-fetch');

module.exports = {
  handleCurrencyConversion: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Respond to "convert" command
    if (message.toLowerCase().startsWith('convert ')) {
      const conversionQuery = message.substring(8); // Extract the conversion query
      const [amount, fromCurrency, toCurrency] = conversionQuery.split(' ');
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/YOUR_API_KEY/pair/${fromCurrency}/${toCurrency}/${amount}`); // Replace with your actual API key
        const data = await response.json();
        if (data.result === 'success') {
          const convertedAmount = data.conversion_result;
          await sock.sendMessage(from, { text: `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}` });
        } else {
          await sock.sendMessage(from, { text: 'Invalid currency codes or amount.' });
        }
      } catch (error) {
        console.error('Error converting currency:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t convert the currency. Try again later!' });
      }
    }
  }
};
