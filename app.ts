import express from 'express';
import { genrateRoute } from './src/generate-route';
import { createPDF } from './src/pdf-generator';
import ejs from 'ejs';
import path from 'path';
import { printPdf } from './src/print';

const app = express()
const port = 3000

const data = {
  title: "Report about some data",
  data: [1, 3, 52, 3],
}

app.get('/', async (req, res) => {
  const pdf = await createPDF(data);

  res.send(pdf);
})

app.get('/generate', genrateRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const passengers = [
  {
    name: "Joyce",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Brock",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Eve",
    flightNumber: 7859,
    time: "18h00",
  },
];

app.get('/ejs', (request, response) => {
  const filePath = path.join(__dirname, "../src/print.ejs")
  console.log(filePath);
  ejs.renderFile(filePath, { passengers }, (err, html) => {
    if (err) {
      return response.send('Cannot read file')
    }

    return response.send(html)
  })

})

app.get('/print', async (request, response) => {
  await printPdf();

  response.send('done');
})
