module.exports = {
  handleSticker: async (sock, msg) => {
    const from = msg.key.remoteJid;

    // Respond to stickers with a thumbs up reaction
    if (msg.message && msg.message.stickerMessage) {
      await sock.sendMessage(from, { react: { text: '👍', key: msg.key } });
    }
  }
};
