const ProcessedEvent = require('../models/ProcessedEvent');

async function isProcessed(eventId) {
  return await ProcessedEvent.findOne({ eventId });
}

async function markProcessed(eventId) {
  await ProcessedEvent.create({ eventId });
}

module.exports = { isProcessed, markProcessed };