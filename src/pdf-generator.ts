import fs from 'fs';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';

const options = {
    width: '1230px',
    displayHeaderFooter: false,
    margin: {
        top: '10px',
        bottom: '30px'
    },
    printBackground: true,
    path: 'result.pdf'
}

const templateHtml = fs.readFileSync('./src/pdf-template.html', 'utf8');
const template = handlebars.compile(templateHtml);


export async function createPDF(data) {
    const html = template(data);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
        waitUntil: 'networkidle0'
    });
    await page.setContent(html);

    const pdf = await page.pdf(options);

    await browser.close();

    return pdf
}
