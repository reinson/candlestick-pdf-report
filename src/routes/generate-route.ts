import { Request, Response } from 'express';
import { JobStatus, startJob, updateJobStatus } from '../model';
import path from 'path';
import ejs from 'ejs';
import { getData } from '../coinapi';
import { candlestickChart } from '../candlestick';
import { writeFile } from 'fs';
import { body, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';
import options from '../../public/options.json';

export enum TimePeriod {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    QUARTER = 'QUARTER',
    YEAR = 'YEAR',
}

export const generateRouteValidation = [
    body('coin').isIn(options.map(option => option.key)),
    body('period').isIn(Object.values(TimePeriod))
];

const coinLookup = Object.fromEntries(options.map(option => [option.key, option]));

export const generateRoute = async (req: Request, res: Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400);
        res.send(validation.array());
        return;
    }

    const id = startJob();
    const { coin, period } = req.body;

    createHTML(coin as string, period as TimePeriod, id);

    res.set('content-type', 'text/plain');
    res.send(id);
};

const createHTML = async (coin: string, period: TimePeriod, id: string) => {
    const filePath = path.join(__dirname, '../../../src/print.ejs');
    const data = await getData(coin, period);
    const svg = candlestickChart(data);

    const html = await ejs.renderFile(filePath, { svg, coinData: coinLookup[coin] });

    const browser = await puppeteer.launch({
        headless: true,
        waitForInitialPage: true,
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter',
    })

    await browser.close()

    const reportPath = path.join(__dirname, `../../../reports/${id}.pdf`);
    writeFile(reportPath, pdf, {}, (err) => {
        if (err) {
            updateJobStatus(id, JobStatus.Failed);
        }

        updateJobStatus(id, JobStatus.Done)
    })
}

