const { Worker } = require('bullmq');
const Redis = require('ioredis');
const dayjs = require('dayjs');
const { Alchemy } = require('alchemy-sdk');
const TokenPrice = require('../db/priceModel');
const { getTokenCreationDate } = require('../services/tokenBirthDate');
const pRetry = require('p-retry');

const connection = new Redis();

const fetchWorker = new Worker('fetch-history', async job => {
  const { token, network } = job.data;
  const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network,
  });

  const creation = await getTokenCreationDate(token, network);
  const start = dayjs(creation).startOf('day');
  const today = dayjs().startOf('day');
  let current = start;

  while (current.isBefore(today)) {
    const ts = current.unix();
    const price = Math.random(); // Replace with price fetching logic

    await TokenPrice.updateOne(
      { token, network, date: current.toDate() },
      { $set: { price } },
      { upsert: true }
    );

    current = current.add(1, 'day');
  }
}, { connection });

console.log('BullMQ Worker is running...');