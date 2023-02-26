import React from 'react';
import { useState } from 'react';
import Button from './components/Button';
import './App.css';
import CoinSelect, { CoinOption } from './components/CoinSelect';
import PeriodSelect, { TimePeriodOption } from './components/PeriodSelect';

function App() {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriodOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string | null>(null);

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setReportId(null);

    const result = await fetch(`/generate?coin=${selectedCoin?.value}&period=${timePeriod?.key}`);
    const jobId = await result.text();

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await fetch(`/status?id=${jobId}`);
      const { status } = await result.json();

      if (status === 'DONE') {
        setReportId(`http://localhost:3001/download?id=${jobId}`);

        setIsLoading(false);
        return;
      }

      // handle errors
    }
  }

  const showSubmitButton = selectedCoin && timePeriod;

  return (
    <div className="App">
      <h1>Crypto price report</h1>
      <div style={{ width: '220px' }}>
        <CoinSelect setSelectedCoin={setSelectedCoin} />
        <PeriodSelect setSelectedPeriod={setTimePeriod} />
        {showSubmitButton && <Button onClick={onSubmit} loading={isLoading} />}
        {reportId && <a href={reportId}>download</a>}
      </div>
    </div>
  );
}

export default App;
