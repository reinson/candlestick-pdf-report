# Crypto price report

Fullstack web application for creating PDF price reports of cryptocurrencies.

## How it works

* Fetches historical prices from [CoinAPI.io](https://www.coinapi.io/).
* Uses [D3](https://www.npmjs.com/package/d3) for creating a svg graph for the report.
* [EJS](https://www.npmjs.com/package/ejs) template for SSR of a template HTML.
* [Puppeteer](https://www.npmjs.com/package/puppeteer) for turning the generated HTML to PDF

## Development

1. Create file `token.txt` to root directory and add CoinAPI token on the first line as plain text. Repository also contains some example data files in the `/data` directory, but these are not used by default.
2. Install dependencies for BE with running `npm i`.
3. Install dependencies for FE with running `npm i` in `/client` directory
4. Build tsc with `npm run build`
5. Start BE with `npm run start`
6. Start FE with `npm run start:FE`
7. Navigate to `http://localhost:3000/` to test it out

