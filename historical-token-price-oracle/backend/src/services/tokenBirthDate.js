const { Alchemy, Network } = require('alchemy-sdk');

const networkMap = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
};

async function getTokenCreationDate(token, networkName) {
  const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: networkMap[networkName],
  });

  const res = await alchemy.core.getAssetTransfers({
    contractAddress: token,
    category: ["erc20"],
    order: "asc",
    maxCount: 1,
  });

  return res.transfers[0]?.metadata?.blockTimestamp;
}

module.exports = { getTokenCreationDate };
