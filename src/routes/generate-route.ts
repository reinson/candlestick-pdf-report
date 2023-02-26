import { Request, Response } from 'express';
import { JobStatus, startJob, updateJobStatus } from '../model';
import path from 'path';
import ejs from 'ejs';
import { getData } from '../coinapi';
import { candlestickChart } from '../reportUtils/candlestick';
import { writeFileSync } from 'fs';
import { body, validationResult } from 'express-validator';
import options from '../../public/options.json';
import createPdf from '../reportUtils/puppeteerPdfGeneration';

export enum TimePeriod {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
}

const coinLookup = Object.fromEntries(options.map(coinData => [coinData.key, coinData]));

export const generateRouteValidation = [
    body('coin').isIn(options.map(option => option.key)),
    body('period').isIn(Object.values(TimePeriod))
];

export const generateRoute = async (req: Request, res: Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400);
        res.send(validation.array());
        return;
    }

    const id = startJob();
    const { coin, period } = req.body;

    try {
        await createReport(coin as string, period as TimePeriod, id);
        updateJobStatus(id, JobStatus.Done)
    } catch (err) {
        console.log(err)
        updateJobStatus(id, JobStatus.Failed);
    }

    res.set('content-type', 'text/plain');
    res.send(id);
};

const createReport = async (coin: string, period: TimePeriod, id: string) => {
    const data = await getData(coin, period);
    const svg = candlestickChart(data);

    const templatePath = path.join(__dirname, '../../../src/reportUtils/template.ejs');
    const html = await ejs.renderFile(templatePath, { svg, coinData: coinLookup[coin] });

    const pdf = await createPdf(html);

    const reportPath = path.join(__dirname, `../../../reports/${id}.pdf`);
    writeFileSync(reportPath, pdf);
}


