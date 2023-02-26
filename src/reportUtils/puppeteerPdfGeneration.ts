import puppeteer from 'puppeteer';

export default async (html: string) => {
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

    return pdf;
}
