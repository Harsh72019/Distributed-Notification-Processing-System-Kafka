const Notification = require('../models/Notification');

async function processNotification(data) {
  await Notification.create({
    userId: data.userId,
    message: data.message,
    type: data.type
  });

  console.log("Processed by instance:", process.env.INSTANCE_ID);
}

module.exports = { processNotification };