import React, { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState("");
  const [getBlock, setGetBlock] = useState("");
  const [blockWithTransactions, setBlockWithTransactions] = useState("");
  const [addressActivity, setAddressActivity] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);

      const latestBlock = await alchemy.core.getBlock(latestBlockNumber);
      setGetBlock(latestBlock);

      const latestBlockWithTransactions = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
      setBlockWithTransactions(latestBlockWithTransactions);
    }

    fetchData();
  }, []);

  async function getAddressActivity(address) {
    const transactions = await alchemy.search.getTransactions({
      addresses: [address],
    });

    setAddressActivity(transactions.result);
  }

  return (
    <div className="App">
      <p>The latest block is: {blockNumber}</p>
      <br />
      <p>Block details: {JSON.stringify(getBlock)}</p>
      <br />
      <p>The block transactions: {JSON.stringify(blockWithTransactions)}</p>
      <br />
      <div>
        <h2>Address Activity</h2>
        <input
          type="text"
          placeholder="Enter address"
          onChange={(e) => getAddressActivity(e.target.value)}
        />
        {addressActivity.map((transaction) => (
          <div key={transaction.hash}>
            <p>Hash: {transaction.hash}</p>
            <p>Block Number: {transaction.blockNumber}</p>
            <p>From: {transaction.from}</p>
            <p>To: {transaction.to}</p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


