const Redis = require('../config/redis');
const { default: Redlock } = require('redlock');

const redlock = new Redlock(
  [Redis],
  {
    retryCount: 0, // we handle retry manually
  }
);

async function acquireLock(eventId) {
  try {
    const lock = await redlock.acquire(
      [`locks:notification:${eventId}`],
      5000 // lock for 5 seconds
    );

    return lock;
  } catch (err) {
    return null; // lock not acquired
  }
}

async function releaseLock(lock) {
  try {
    await lock.release();
  } catch (err) {
    console.error("Lock release failed");
  }
}

module.exports = { acquireLock, releaseLock };