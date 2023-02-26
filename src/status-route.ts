import { Request, Response } from 'express';
import { ERR_UNKNOWN_JOB, getJobStatus } from './model';

export const statusRoute = async (req: Request, res: Response) => {
    const id = req.query.id;

    console.log('reading status', id)

    try {
        const status = getJobStatus(id as string);
        res.send({ status });
    } catch (err) {
        if (err.message === ERR_UNKNOWN_JOB) {
            res.status(400);
            res.send(ERR_UNKNOWN_JOB);
        } else {
            res.status(500);
            res.send('Something went wrong');
        }
    }
}
