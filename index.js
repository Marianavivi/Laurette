const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleSticker } = require('./plugins/sticker');
const { handleImageSearch } = require('./plugins/imageSearch');
const { handleImageGeneration } = require('./plugins/imageGeneration');
const { handleJoke } = require('./plugins/joke');
const { handleReminder } = require('./plugins/reminder');
const { handleChatbot } = require('./plugins/chatbot');
const { handleWeather } = require('./plugins/weather');
const { handleAudio } = require('./plugins/audio');
const { handleGif } = require('./plugins/gif');
const { handleDictionary } = require('./plugins/dictionary');
const { handleCurrencyConversion } = require('./plugins/currency');
const { handleMovieInfo } = require('./plugins/movie');
const { handleAlarm } = require('./plugins/alarm');
const { handleGreetings } = require('./plugins/greetings');
const { handleHelp } = require('./plugins/help');
const { handleSummarization } = require('./plugins/summarize');
const { handleTranscription } = require('./plugins/transcription');
const { handlePoll } = require('./plugins/poll');

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
          await handleGreetings(sock, msg);
          await handleSticker(sock, msg);
          await handleImageSearch(sock, msg);
          await handleImageGeneration(sock, msg);
          await handleJoke(sock, msg);
          await handleReminder(sock, msg);
          await handleChatbot(sock, msg);
          await handleWeather(sock, msg);
          await handleAudio(sock, msg);
          await handleGif(sock, msg);
          await handleDictionary(sock, msg);
          await handleCurrencyConversion(sock, msg);
          await handleMovieInfo(sock, msg);
          await handleAlarm(sock, msg);
          await handleHelp(sock, msg);
          await handleSummarization(sock, msg);
          await handleTranscription(sock, msg);
          await handlePoll(sock, msg);
        }
      }
    }
  });
};

// Start the bot
connectToWhatsApp();
