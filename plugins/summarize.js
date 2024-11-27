const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY', // Replace with your actual API key
});
const openai = new OpenAIApi(configuration);

module.exports = {
  handleSummarization: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('summarize ')) {
      const textToSummarize = message.substring(11); // Extract the text to summarize
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Summarize this:\n\n${textToSummarize}`,
          max_tokens: 150, // Adjust as needed
          temperature: 0.7, // Adjust as needed
        });
        const summary = response.data.choices[0].text.trim();
        await sock.sendMessage(from, { text: summary });
      } catch (error) {
        console.error('Error summarizing text:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t summarize that. Try again later!' });
      }
    }
  }
};
