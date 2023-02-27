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

  const setGeneralError = () => setError('Something went wrong');

  const onSubmit = async () => {
    setIsLoading(true);
    setReportId(null);

    const jobId = await makeGenerateRequest(selectedCoin?.key, timePeriod?.key).catch(setGeneralError);

    while (jobId) {
      const status = await makeStatusPingRequest(jobId).catch(setGeneralError);

      switch (status) {
        case 'PENDING': {
          await new Promise((resolve) => setTimeout(resolve, 500));
          break;
        }
        case 'DONE': {
          setReportId(jobId);
          setIsLoading(false);
          return;
        }
        default: {
          setError('Report generation failed');
          return;
        }
      }
    }
  }

  return (
    <div className='App'>
      <h1>Crypto price report</h1>
      <div style={{ width: '230px' }}>
        <CoinSelect setSelectedCoin={setSelectedCoin} />
        <PeriodSelect setSelectedPeriod={setTimePeriod} />
        {selectedCoin && timePeriod && !error && <Button onSubmit={onSubmit} loading={isLoading} />}
        {reportId && !error && <a href={`http://localhost:3001/download?id=${reportId}`}>download</a>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
}

const makeStatusPingRequest = async (jobId: string) => {
  const result = await fetch(`/status?id=${jobId}`)
  const { status } = await result.json();
  return status;
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

  if (!result.ok) {
    throw new Error();
  }

  return await result.text();
}

export default App;
