import express from 'express';
import { generateRoute, generateRouteValidation } from './src/routes/generate-route';
import { downloadRoute } from './src/routes/download-route';
import { query } from 'express-validator';
import { statusRoute } from './src/routes/status-route';

const quaryHasId = [query('id').isString()];

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.json());

app.post('/generate', generateRouteValidation, generateRoute);

app.get('/download', quaryHasId, downloadRoute)

app.get('/status', quaryHasId, statusRoute);

app.listen(port, () => {
  console.log(`Crypto price app listening on port ${port}`)
});
