// plugins/help.js
module.exports = {
  handleHelp: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase() === 'help') {
      const helpMenu = `
      Here are the commands you can use:

      * Greetings:
        - hello
        - who are you
        - what can you do

      * General:
        - time
        - fun fact
        - news
        - joke
        - translate [text]
        - weather [location]

      * Images:
        - cat
        - image [search query]
        - generate [prompt]

      * Group:
        - create poll [question];[option1];[option2];...

      * Settings:
        - setprefix [new prefix]

      * Other:
        - menu
        - help
      `;
      await sock.sendMessage(from, { text: helpMenu });
    }
  }
};
