const cron = require('node-cron');

const reminders = {}; // Store reminders in memory (consider using a database for persistence)

module.exports = {
  handleReminder: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('remind me ')) {
      const reminderText = message.substring(10); // Extract the reminder text
      const [time, ...rest] = reminderText.split(' '); // Split the reminder text into time and message
      const cronExpression = time; // Use the time as the cron expression (e.g., "in 5 minutes", "at 8:00 PM")
      const reminderMessage = rest.join(' '); // Join the remaining parts to form the reminder message

      try {
        const task = cron.schedule(cronExpression, () => {
          sock.sendMessage(from, { text: `Reminder: ${reminderMessage}` });
        });
        reminders[from] = task; // Store the task for later cancellation (if needed)
        await sock.sendMessage(from, { text: `Reminder set for ${cronExpression}` });
      } catch (error) {
        console.error('Error setting reminder:', error);
        await sock.sendMessage(from, { text: 'Invalid reminder format. Please use "remind me [time] [message]".' });
      }
    }
  }
};
