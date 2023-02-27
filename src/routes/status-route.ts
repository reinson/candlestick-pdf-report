import { Request, Response } from 'express';
import { ERR_UNKNOWN_JOB } from '../errors';
import { getJobStatus } from '../jobsModel';

export const statusRoute = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const status = getJobStatus(id as string);
        res.send({ status });
    } catch (err) {
        if (err.message === ERR_UNKNOWN_JOB) {
            res.status(400);
            res.send(`Cannot find a job with '${id}' id`);
        } else {
            res.status(500);
            res.send('Something went wrong');
        }
    }
}
