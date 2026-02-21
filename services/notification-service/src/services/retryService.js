const kafkaClient = require('../config/kafka');

const MAX_RETRY = 5;
const BASE_DELAY = 500; // 500ms

function getBackoffDelay(retryCount) {
  return BASE_DELAY * Math.pow(2, retryCount);
}

async function retryOrDLQ(payload) {
  const retryCount = payload.retryCount || 0;

  if (retryCount < MAX_RETRY) {

    const delay = getBackoffDelay(retryCount);

    setTimeout(async () => {
      await kafkaClient.producer.send({
        topic: 'notifications',
        messages: [{
          value: JSON.stringify({
            ...payload,
            retryCount: retryCount + 1
          })
        }]
      });
    }, delay);

  } else {
    await kafkaClient.producer.send({
      topic: 'notifications-dlq',
      messages: [{
        value: JSON.stringify(payload)
      }]
    });
  }
}

module.exports = { retryOrDLQ };