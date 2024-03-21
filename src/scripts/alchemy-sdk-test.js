import { Network, Alchemy } from 'alchemy-sdk';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: 'Wv0dFwEX_xueX5Lj-Byexpdh-IEXWGKh', // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Access standard Ethers.js JSON-RPC node request
console.log('Block number: ', await alchemy.core.getBlockNumber());


// curl https://eth-mainnet.g.alchemy.com/v2/Wv0dFwEX_xueX5Lj-Byexpdh-IEXWGKh -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":73}'

// curl -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":73}' -X POST -H "Content-Type: application/json" https://eth-mainnet.g.alchemy.com/v2/Wv0dFwEX_xueX5Lj-Byexpdh-IEXWGKh

// curl https://eth-mainnet.g.alchemy.com/v2/Wv0dFwEX_xueX5Lj-Byexpdh-IEXWGKh -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":42}'