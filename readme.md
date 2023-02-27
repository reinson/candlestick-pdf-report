# Candlestick chart price report

Fullstack web application for creating candlistick price reports in PDF format.

## How it works

* Fetches historical prices of cryptocurrencies from [CoinAPI.io](https://www.coinapi.io/).
* FE is based on [create-react-app](https://create-react-app.dev/)
* Uses [D3](https://www.npmjs.com/package/d3) for creating a svg graph for the report. Candlestick chart is a modified version of a work shared in [this](https://observablehq.com/@d3/candlestick-chart) Observablehq notebook
* [EJS](https://www.npmjs.com/package/ejs) for SSR of a template HTML
* [Puppeteer](https://www.npmjs.com/package/puppeteer) for turning the generated HTML to PDF

## Development

1. Create file `token.txt` to root directory and add CoinAPI api token on the first line as plain text. Repository also contains some example data files in the `/data` directory, but these are not used by default.
2. Install dependencies for BE with running `npm i`.
3. Install dependencies for FE with running `npm i` in `/client` directory
4. Transpile typescript with `npm run build`
5. Start BE with `npm run start`
6. Start FE with `npm run start:FE`
7. Navigate to `http://localhost:3000/` to test it out

## Example report

See example report in root direcotry ([example-report.pdf](https://github.com/reinson/crypto-price-report/blob/master/example-report.pdf))
