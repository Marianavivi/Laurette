const cron = require('node-cron');

const alarms = {}; // Store alarms in memory

module.exports = {
  handleAlarm: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    if (message.toLowerCase().startsWith('set alarm ')) {
      const alarmTime = message.substring(10); // Extract the alarm time

      try {
        const task = cron.schedule(alarmTime, () => {
          sock.sendMessage(from, { text: 'Alarm!' });
        });
        alarms[from] = task; // Store the task for later cancellation (if needed)
        await sock.sendMessage(from, { text: `Alarm set for ${alarmTime}` });
      } catch (error) {
        console.error('Error setting alarm:', error);
        await sock.sendMessage(from, { text: 'Invalid alarm time format. Please use a valid cron expression.' });
      }
    } else if (message.toLowerCase() === 'cancel alarm') {
      if (alarms[from]) {
        alarms[from].stop();
        delete alarms[from];
        await sock.sendMessage(from, { text: 'Alarm canceled.' });
      } else {
        await sock.sendMessage(from, { text: 'You don\'t have an alarm set.' });
      }
    }
  }
};
