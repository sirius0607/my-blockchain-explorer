# My Block Explorer
 
 This project is an Ethereum Block Explorer based on https://github.com/alchemyplatform/blockexplorer.

Blockexplorers give us the ability to view lots of different information about the blockchain including data about:

- the blockchain network itself
- blocks in the blockchain
- transactions in a block
- accounts

[Etherscan](https://etherscan.io/) is a good example of an Ethereum blockexplorer.

# How to Start

To be able to use Alchemy SDK to make JSON RPC calls to the Ethereum Blockchain nodes you need to create an Alchemy API key.

1. Create a unique Alchemy API key. Go to https://docs.alchemy.com/reference/api-overview

2. Add your API key as an environment variable for the project

To do so, create an empty `.env` file in the base directory of this project.

Add the following line to the `.env` file replacing **YOUR_ALCHEMY_API_KEY** with your api key.

`VITE_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY`

Do not remove the **VITE_ prefix**. Vite uses that to import env variables.

## How to use
1. Clone/Download the repo.
2. Run  ``` npm install ```.
4. Run ```npm run dev``` to run the app in the development mode. Open http://localhost:5173 to view it in the browser.