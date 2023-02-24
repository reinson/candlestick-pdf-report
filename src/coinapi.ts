import axios from 'axios';
import fs from 'fs';

const COINAPI_URL = 'https://rest.coinapi.io/v1/exchangerate/EUR/USD/history';
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


export const getData = async (writeToFile?: boolean): Promise<Quote[]> => {
    console.log('getting data')
    const { data } = await axios.get(COINAPI_URL, {
        params: {
            period_id: '10DAY',
            time_start: '2021-01-01T00:00:00',
            time_end: '2023-02-23T00:00:00'
        },
        headers: {
            'X-CoinAPI-Key': token,
        }
    });

    if (writeToFile) {
        writeData(data, '1MIN_YTD');
    }

    return data.map(transformQuotes);
}

function readToken(fileName: string) {
    try {
        return fs.readFileSync(fileName, 'utf8').split(/\r?\n/)[0];
    } catch (err) {
        console.log('Feiled to read api token from file');
    }
}

function writeData(data, name) {
    const jsonContent = JSON.stringify(data);

    fs.writeFile(`./data/${name}.json`, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }

        console.log('JSON file has been saved.');
    });
}
