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

    // Respond with a custom display name and greeting variations
    if (message.toLowerCase() === 'hello') {
        const greetings = [
            "Hello there! It's Laurette here. How can I help you today?",
            "Hi! Laurette at your service. What can I do for you?",
            "Hey! It's Laurette. What's up?"
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        await sock.sendMessage(from, { text: randomGreeting });
    }

    // Respond to "who are you?"
    if (message.toLowerCase().includes('who are you')) {
        await sock.sendMessage(from, { text: "I'm Laurette, your friendly WhatsApp bot. I'm here to help you with whatever you need." });
    }

    // Respond to "what can you do?"
    if (message.toLowerCase().includes('what can you do')) {
        await sock.sendMessage(from, { text: "I'm still learning, but I can do things like greet you, answer simple questions, and maybe even tell you a joke if you ask nicely." });
    }

    // Respond to "time"
    if (message.toLowerCase() === 'time') {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        await sock.sendMessage(from, { text: `The current time is ${timeString}` });
    }
};

// Start the bot
connectToWhatsApp();
