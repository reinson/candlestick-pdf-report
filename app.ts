import express from 'express';
import { genrateRoute } from './src/generate-route';
import ejs from 'ejs';
import path from 'path';
import { printPdf } from './src/print';
import { candlestickChart } from './src/candlestick';
import { getData } from './src/coinapi';

const app = express()
const port = 3000

app.get('/generate', genrateRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/ejs', (request, response) => {
  const filePath = path.join(__dirname, "../src/print.ejs")
  const data = getData();
  const svg = candlestickChart(data, { yLabel: 'USD' });

  ejs.renderFile(filePath, { svg }, (err, html) => {
    if (err) {
      console.log("🚀 ~ file: app.ts:56 ~ ejs.renderFile ~ err", err)
      return response.send('Cannot read file')
    }

    return response.send(html)
  })

})

app.get('/print', async (request, response) => {

  await printPdf();
  response.send('done');
})
