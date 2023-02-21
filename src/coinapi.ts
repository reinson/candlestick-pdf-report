import fs from 'fs';

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

export const getData = (): Quote[] => {
    const data = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));

    return data.map(transformQuotes);
}


