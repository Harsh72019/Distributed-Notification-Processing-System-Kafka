const express = require('express');
const { v4: uuid } = require('uuid');
const sendNotification = require('../kafka/producer');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { userId, message, type } = req.body;

  await sendNotification({
    eventId: uuid(),
    userId,
    message,
    type
  });

  res.json({ status: 'Notification queued' });
});

module.exports = router;