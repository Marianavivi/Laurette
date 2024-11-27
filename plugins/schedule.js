const cron = require('node-cron');

const scheduledMessages = {}; // Store scheduled messages in memory

module.exports = {
  handleSchedule: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('schedule ')) {
      const scheduleData = message.substring(9); // Extract the schedule data
      const [time, ...rest] = scheduleData.split(' '); // Split the schedule data into time and message
      const cronExpression = time; // Use the time as the cron expression (e.g., "in 5 minutes", "at 8:00 PM")
      const scheduledMessage = rest.join(' '); // Join the remaining parts to form the scheduled message

      try {
        const task = cron.schedule(cronExpression, () => {
          sock.sendMessage(from, { text: scheduledMessage });
        });
        scheduledMessages[from] = task; // Store the task for later cancellation (if needed)
        await sock.sendMessage(from, { text: `Message scheduled for ${cronExpression}` });
      } catch (error) {
        console.error('Error scheduling message:', error);
        await sock.sendMessage(from, { text: 'Invalid schedule format. Please use "schedule [time] [message]".' });
      }
    } else if (message.toLowerCase() === 'cancel schedule') {
      if (scheduledMessages[from]) {
        scheduledMessages[from].stop();
        delete scheduledMessages[from];
        await sock.sendMessage(from, { text: 'Scheduled message canceled.' });
      } else {
        await sock.sendMessage(from, { text: 'You don\'t have any scheduled messages.' });
      }
    }
  }
};
