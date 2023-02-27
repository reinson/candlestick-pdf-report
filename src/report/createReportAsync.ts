import path from 'path';
import ejs from 'ejs';
import { writeFileSync } from 'fs';

import { getData, getPeriodOptions, TimePeriod } from '../coinapi';
import { JobStatus, updateJobStatus } from '../jobsModel';
import { candlestickChart } from './candlestick';
import options from '../../public/options.json';
import { createPdf } from './puppeteerPdfGeneration';

const coinLookup = Object.fromEntries(options.map(coinData => [coinData.key, coinData]));

export const createReportAsync = async (coin: string, period: TimePeriod, id: string) => {
    try {
        await createReport(coin, period, id);
        updateJobStatus(id, JobStatus.Done);
    } catch (err) {
        console.log(err);
        updateJobStatus(id, JobStatus.Failed);
    }
}

const createReport = async (coin: string, period: TimePeriod, id: string) => {
    const data = await getData(coin, period);
    const svg = candlestickChart(data);

    const templatePath = path.join(__dirname, '../../../src/report/template.ejs');
    const periodData = getPeriodOptions(period);
    const html = await ejs.renderFile(templatePath, { svg, coinData: coinLookup[coin], periodData });

    const pdf = await createPdf(html);

    const reportPath = path.join(__dirname, `../../../reports/${id}.pdf`);
    writeFileSync(reportPath, pdf);
}
