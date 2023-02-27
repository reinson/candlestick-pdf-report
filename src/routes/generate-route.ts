import { Request, Response } from 'express';

import { startJob } from '../jobsModel';
import { body, validationResult } from 'express-validator';
import options from '../../public/options.json';
import { createReportAsync } from '../report/createReportAsync';
import { TimePeriod } from '../coinapi';

export const generateRouteValidation = [
    body('coin').isIn(options.map(option => option.key)),
    body('period').isIn(Object.values(TimePeriod))
];

export const generateRoute = async (req: Request, res: Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(400);
        res.send(validation.array());
        return;
    }

    const id = startJob();
    const { coin, period } = req.body;

    createReportAsync(coin, period, id);

    res.set('content-type', 'text/plain');
    res.send(id);
};
