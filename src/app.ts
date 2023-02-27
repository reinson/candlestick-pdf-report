import express from 'express';
import { generateRoute, generateRouteValidation } from './routes/generate-route';
import { downloadRoute } from './routes/download-route';
import { statusRoute } from './routes/status-route';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/generate', generateRouteValidation, generateRoute);

app.get('/download', downloadRoute)

app.get('/status', statusRoute);

export default app;
