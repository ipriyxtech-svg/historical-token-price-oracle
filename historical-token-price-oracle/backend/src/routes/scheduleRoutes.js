const express = require('express');
const router = express.Router();
const { scheduleHistoryJob } = require('../jobs/scheduler');

  await scheduleHistoryJob(token, network);
router.post('/', async (req, res) => {
  const { token, network } = req.body;
  res.json({ status: 'scheduled' });
});

module.exports = router;