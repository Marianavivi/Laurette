const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY', // Replace with your actual API key
});
const openai = new OpenAIApi(configuration);

module.exports = {
  handleImageGeneration: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('generate ')) {
      const prompt = message.substring(9); // Extract the prompt
      try {
        const response = await openai.createImage({
          prompt: prompt,
          n: 1, // Number of images to generate
          size: "512x512", // Image size
        });
        const imageUrl = response.data.data[0].url;
        await sock.sendMessage(from, { image: { url: imageUrl } });
      } catch (error) {
        console.error('Error generating image:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t generate an image for that. Try again later!' });
      }
    }
  }
};
