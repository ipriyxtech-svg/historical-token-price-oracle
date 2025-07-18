const dayjs = require('dayjs');
const { Alchemy, Network } = require('alchemy-sdk');
const TokenPrice = require('../db/priceModel');
const { interpolate } = require('../utils/interpolator');

const networkMap = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
};

function initAlchemy(network) {
  return new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: networkMap[network],
  });
}

async function getHistoricalPrice(token, network, timestamp) {
  const alchemy = initAlchemy(network);
  const targetDate = dayjs.unix(timestamp).startOf('day').toDate();
  const cached = await TokenPrice.findOne({ token, network, date: targetDate });
  if (cached) return { price: cached.price, source: 'cache' };

  const before = await TokenPrice.findOne({ token, network, date: { $lt: targetDate } }).sort({ date: -1 });
  const after = await TokenPrice.findOne({ token, network, date: { $gt: targetDate } }).sort({ date: 1 });

  if (before && after) {
    const interpolated = interpolate(
      timestamp,
      dayjs(before.date).unix(),
      before.price,
      dayjs(after.date).unix(),
      after.price
    );
    return { price: interpolated, source: 'interpolated' };
  }

  try {
    const block = await alchemy.core.getBlock(timestamp);
    const price = Math.random(); // Replace with real logic
    return { price, source: 'alchemy' };
  } catch (e) {
    return { error: 'Price data not available' };
  }
}

module.exports = { getHistoricalPrice };

