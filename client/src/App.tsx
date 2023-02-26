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
  const [error, setError] = useState<string | null>('');

  const generalErrorHandler = () => setError('Something went wrong');

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setReportId(null);

    const jobId = await makeGenerateRequest(selectedCoin?.key, timePeriod?.key).catch(generalErrorHandler);

    while (jobId && !error) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await fetch(`/status?id=${jobId}`);
      const { status } = await result.json();

      switch (status) {
        case 'DONE': {
          setReportId(`http://localhost:3001/download?id=${jobId}`);
          setIsLoading(false);
          return;
        }

        case 'FAILED': {
          setError('Report generation failed');
          return;
        }
      }
    }
  }

  const showSubmitButton = selectedCoin && timePeriod && !error;

  return (
    <div className='App'>
      <h1>Crypto price report</h1>
      <div style={{ width: '220px' }}>
        <CoinSelect setSelectedCoin={setSelectedCoin} />
        <PeriodSelect setSelectedPeriod={setTimePeriod} />
        {showSubmitButton && <Button onClick={onSubmit} loading={isLoading} />}
        {reportId && !error && <a href={reportId}>download</a>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

const makeGenerateRequest = async (coin: string | undefined, period: string | undefined) => {
  if (!coin || !period) {
    throw new Error('Missing input data');
  }

  const result = await fetch('/generate', {
    method: 'POST',
    body: JSON.stringify({ coin, period }),
    headers: {
      "Content-Type": "application/json",
    }
  });

  return await result.text();
}

export default App;
