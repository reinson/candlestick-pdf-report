import puppeteer from 'puppeteer';
import { writeFile } from 'fs';

export const printPdf = async () => {
    console.log('starting')

    const browser = await puppeteer.launch({
        headless: true,
        waitForInitialPage: true,
    })
    const page = await browser.newPage()

    await page.goto('http://localhost:3000/ejs')

    console.log('done')

    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter'
    })

    await browser.close()

    writeFile("./report.pdf", pdf, {}, (err) => {
        if (err) {
            return console.error('error')
        }

        console.log('success!')
    })

};
