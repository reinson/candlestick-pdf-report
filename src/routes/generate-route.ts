import { Request, Response } from 'express';
import { JobStatus, startJob, updateJobStatus } from '../model';
import path from 'path';
import ejs from 'ejs';
import { getData } from '../coinapi';
import { candlestickChart } from '../candlestick';
import { writeFile } from 'fs';
import { query, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';

export enum TimePeriod {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
}

export const generateRouteValidation = [
    query('coin').isIn(['BTC', 'ETH']),
    query('period').isIn(Object.values(TimePeriod))
];

export const generateRoute = (req: Request, res: Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400);
        res.send(validation.array());
        return;
    }

    const id = startJob();
    const { coin, period } = req.query;

    createHTML(coin as string, period as TimePeriod, id);

    res.set('content-type', 'text/plain');
    res.send(id);
};

const createHTML = async (coin: string, period: TimePeriod, id: string) => {
    const filePath = path.join(__dirname, '../../../src/print.ejs');
    const data = await getData(coin, period);
    const svg = candlestickChart(data, { yLabel: 'USD' });

    const html = await ejs.renderFile(filePath, { svg });

    const browser = await puppeteer.launch({
        headless: true,
        waitForInitialPage: true,
    });
    const page = await browser.newPage();

    await page.setContent(html);

    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter'
    })

    await browser.close()

    const reportPath = path.join(__dirname, `../../../reports/${id}.pdf`);
    writeFile(reportPath, pdf, {}, (err) => {
        if (err) {
            throw err;
        }

        updateJobStatus(id, JobStatus.Done)
    })
}

