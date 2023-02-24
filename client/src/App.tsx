import React from 'react';
import { useState } from 'react';
import './App.css';
import CoinSelect from './components/CoinSelect';

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate crypto price report</h1>
        <CoinSelect selectedCoin={selectedCoin} setSelectedCoin={setSelectedCoin} />
      </header>
    </div>
  );
}

export default App;


