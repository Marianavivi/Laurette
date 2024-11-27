module.exports = {
  handlePoll: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Respond to "create poll" command
    if (message.toLowerCase().startsWith('create poll ')) {
      const pollData = message.substring(12); // Extract the poll data
      const [question, ...options] = pollData.split(';'); // Split the poll data into question and options

      try {
        await sock.sendMessage(from, {
          poll: {
            name: question,
            options: options.map(option => ({ optionName: option.trim() }))
          }
        });
      } catch (error) {
        console.error('Error creating poll:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t create the poll. Try again later!' });
      }
    }
  }
};
