import { Request, Response } from 'express';
import { startJob } from './model';


export const genrateRoute = (req: Request, res: Response) => {
    const id = startJob();

    res.set('content-type', 'text/plain');
    res.send(id);
};

