import express from 'express';
import { createPDF } from './src/pdf-generator';

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
