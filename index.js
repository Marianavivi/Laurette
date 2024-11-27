const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');
const qrcode = require('qrcode-terminal');

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
                }
            }
        }
    });
};

// Function to handle incoming messages
const handleMessage = async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Example: Respond to a "hello" message
    if (message.toLowerCase() === 'hello') {
        await sock.sendMessage(from, { text: 'Hello there!' });
    }
};

// Start the bot
connectToWhatsApp();
