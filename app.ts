import express from 'express';
import { generateRoute, generateRouteValidation } from './src/generate-route';
import { downloadRoute } from './src/download-route';
import { query } from 'express-validator';
import { statusRoute } from './src/status-route';

export const quaryHasId = [
  query('id').isString(),
];

const app = express();
const port = 3001;

app.get('/generate', generateRouteValidation, generateRoute);

app.get('/download', quaryHasId, downloadRoute)

app.get('/status', quaryHasId, statusRoute);

app.listen(port, () => {
  console.log(`Crypto price app listening on port ${port}`)
});
