const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./messageHandlers'); // Import message handlers
const config = require('./config'); // Import configuration settings
const { handleSticker } = require('./plugins/sticker'); // Import the sticker handler

// Function to create a WhatsApp bot
const connectToWhatsApp = async () => {
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp');
    }
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    console.log('Received messages: ', messages);

    if (type === 'notify') {
      for (const msg of messages) {
        if (msg.key && msg.key.remoteJid !== 'status@broadcast') {
          // Handle incoming messages here
          await handleMessage(sock, msg);
          await handleSticker(sock, msg); // Call the sticker handler
        }
      }
    }
  });
};

// Start the bot
connectToWhatsApp();
