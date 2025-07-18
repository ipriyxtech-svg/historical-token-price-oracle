const express = require('express');
const router = express.Router();
const { getHistoricalPrice } = require('../services/priceService');

router.get('/', async (req, res) => {
  const { token, network, timestamp } = req.body;
  const result = await getHistoricalPrice(token, network, Number(timestamp));
  res.json(result);
});

module.exports = router;