const { downloadMediaMessage } = require('@adiwajshing/baileys');

module.exports = {
  handleAudio: async (sock, msg) => {
    const from = msg.key.remoteJid;

    // Handle audio messages
    if (msg.message && msg.message.audioMessage) {
      try {
        const audioBuffer = await downloadMediaMessage(msg, 'audio', {});
        const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Replace with your audio URL
        await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' });
      } catch (error) {
        console.error('Error playing audio:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t play the audio. Try again later!' });
      }
    }
  }
};
