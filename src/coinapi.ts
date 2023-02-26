import axios from 'axios';
import fs from 'fs';
import { TimePeriod } from './generate-route';

const token = readToken('token.txt');

type ApiQuote = {
    time_period_start: string,
    time_period_end: string,
    time_open: string,
    time_close: string,
    rate_open: number,
    rate_high: number,
    rate_low: number,
    rate_close: number
}

export type Quote = {
    start: Date,
    end: Date,
    date: Date,
    rate: {
        open: number,
        high: number,
        low: number,
        close: number,
    }
}

const getPeriodOptions = (key: TimePeriod) => {
    switch (key) {
        case TimePeriod.DAY:
            return { periodId: '15MIN', startDate: '2023-02-24' };
        case TimePeriod.WEEK:
            return { periodId: '2HRS', startDate: '2023-02-17' };
        case TimePeriod.MONTH:
            return { periodId: '1DAY', startDate: '2023-01-24' };
        case TimePeriod.QUARTER:
            return { periodId: '1DAY', startDate: '2022-11-24' };
        case TimePeriod.YEAR:
            return { periodId: '7DAY', startDate: '2022-02-24' };
    }
}

const transformQuotes = (quote: ApiQuote): Quote => ({
    start: new Date(quote.time_period_start),
    end: new Date(quote.time_period_end),
    date: middleDate(quote.time_period_start, quote.time_period_end),
    rate: {
        open: quote.rate_open,
        high: quote.rate_high,
        low: quote.rate_low,
        close: quote.rate_close,
    }
});

const middleDate = (start: string, end: string): Date => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return new Date((startDate.getTime() + endDate.getTime()) / 2);
};

export const getStoredData = (name: string): Quote[] => {
    const data = JSON.parse(fs.readFileSync(`./data/${name}.json`, 'utf-8'));

    return data.map(transformQuotes);
}

export const getData = async (coin: string, period: TimePeriod): Promise<Quote[]> => {
    const { periodId, startDate } = getPeriodOptions(period);
    const { data } = await axios.get(`https://rest.coinapi.io/v1/exchangerate/${coin}/USD/history`, {
        params: {
            period_id: periodId,
            time_start: startDate,
        },
        headers: {
            'X-CoinAPI-Key': token,
        }
    });

    return data.map(transformQuotes);
}

function readToken(fileName: string) {
    try {
        return fs.readFileSync(fileName, 'utf8').split(/\r?\n/)[0];
    } catch (err) {
        console.log('Feiled to read api token from file');
    }
}
