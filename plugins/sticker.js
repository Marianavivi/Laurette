module.exports = {
  handleSticker: async (sock, msg) => {
    const from = msg.key.remoteJid;

    if (msg.message && msg.message.stickerMessage) {
      await sock.sendMessage(from, { react: { text: '👍', key: msg.key } });
    }
  }
};
