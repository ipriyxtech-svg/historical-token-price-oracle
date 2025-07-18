const { Queue } = require('bullmq');
const Redis = require('ioredis');
const connection = new Redis();
const fetchQueue = new Queue('fetch-history', { connection });

async function scheduleHistoryJob(token, network) {
  await fetchQueue.add('fetch-token-history', { token, network });
}

module.exports = { scheduleHistoryJob };
