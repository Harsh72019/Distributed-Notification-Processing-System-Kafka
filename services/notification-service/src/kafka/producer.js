const kafkaClient = require('../config/kafka');

async function sendNotification(payload) {
  await kafkaClient.producer.connect();

  await kafkaClient.producer.send({
    topic: 'notifications',
    messages: [{
      key: payload.userId,
      value: JSON.stringify(payload)
    }]
  });
}

module.exports = sendNotification;