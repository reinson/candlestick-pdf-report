# Crypto price report

Fullstack web application for creating PDF price reports of cryptocurrencies.

## How it works

* Fetches historical prices from [CoinAPI.io](https://www.coinapi.io/).
* Uses [D3](https://www.npmjs.com/package/d3) for creating a svg graph for the report.
* [EJS](https://www.npmjs.com/package/ejs) template for SSR of a template HTML.
* [Puppeteer](https://www.npmjs.com/package/puppeteer) for turning the generated HTML to PDF

## Development

1. Install dependencies for BE with running `npm i`.
2. Install dependencies for FE with running `npm i` in `/client` directory
3. Build tsc with `npm run build`
4. Start BE with `npm run start`
5. Start FE with `npm run start:FE`
6. Navigate to `http://localhost:3000/` to test it out
