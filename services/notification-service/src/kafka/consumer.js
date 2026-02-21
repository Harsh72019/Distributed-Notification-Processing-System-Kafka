const kafkaClient = require('../config/kafka');
const { processNotification } = require('../services/notificationProcessor');
const { isProcessed, markProcessed } = require('../services/idempotencyService');
const { retryOrDLQ } = require('../services/retryService');
const { acquireLock, releaseLock } = require('../services/distributedLockService');

async function startConsumer() {
  await kafkaClient.consumer.connect();
  await kafkaClient.producer.connect();

  await kafkaClient.consumer.subscribe({ topic: 'notifications' });

  await kafkaClient.consumer.run({
    eachMessage: async ({ message }) => {

      const payload = JSON.parse(message.value.toString());
      const { eventId } = payload;

      // 🔐 Acquire distributed lock
      const lock = await acquireLock(eventId);

      if (!lock) {
        console.log("Lock not acquired, skipping");
        return;
      }

      try {

        // Idempotency check
        if (await isProcessed(eventId)) {
          await releaseLock(lock);
          return;
        }

        await processNotification(payload);
        await markProcessed(eventId);

        console.log("Processed by instance:", process.env.INSTANCE_ID);

      } catch (err) {
        await retryOrDLQ(payload);
      } finally {
        await releaseLock(lock);
      }
    }
  });
}

module.exports = startConsumer;