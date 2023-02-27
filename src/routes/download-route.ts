import { Request, Response } from 'express';
import path from 'path';
import { ERR_UNKNOWN_JOB } from '../errors';
import { getJobStatus, JobStatus } from '../jobsModel';

export const downloadRoute = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const status = getJobStatus(id as string);

        if (status !== JobStatus.Done) {
            throw new Error('Job not done');
        }

        const reportPath = path.join(__dirname, `../../../reports/${id}.pdf`);
        res.download(reportPath);
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
