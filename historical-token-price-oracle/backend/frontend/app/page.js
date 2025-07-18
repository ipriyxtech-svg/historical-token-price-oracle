'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [token, setToken] = useState('');
  const [network, setNetwork] = useState('ethereum');
  const [timestamp, setTimestamp] = useState('');
  const [price, setPrice] = useState(null);

  const getPrice = async () => {
    try {
      const res = await axios.post('http://localhost:5000/price', {
        token,
        network,
        timestamp: parseInt(timestamp)
      });
      setPrice(res.data);
    } catch (err) {
      console.error('Error fetching price:', err);
    }
  };

  const scheduleHistory = async () => {
    try {
      await axios.post('http://localhost:5000/schedule', { token, network });
      alert('Scheduled fetch started!');
    } catch (err) {
      console.error('Error scheduling history:', err);
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>🔍 Historical Token Price Oracle</h1>
      <input placeholder="Token Address" value={token} onChange={e => setToken(e.target.value)} />
      <select value={network} onChange={e => setNetwork(e.target.value)}>
        <option value="ethereum">Ethereum</option>
        <option value="polygon">Polygon</option>
      </select>
      <input placeholder="Timestamp (Unix)" value={timestamp} onChange={e => setTimestamp(e.target.value)} />
      <button onClick={getPrice}>Get Price</button>
      <button onClick={scheduleHistory}>Schedule Full History</button>
      {price && (
        <div>
          <p>Price: {price.price}</p>
          <p>Source: {price.source}</p>
        </div>
      )}
    </main>
  );
}
