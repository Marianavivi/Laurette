const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

module.exports = {
  analyzeSentiment: async (text) => {
    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };

      const [result] = await client.analyzeSentiment({ document });
      const sentiment = result.documentSentiment;

      console.log(`Sentiment score: ${sentiment.score}`);
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

      return sentiment;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  }
};
