import crypto from 'crypto';

export const ERR_UNKNOWN_JOB = 'Unknown job';

export enum JobStatus {
    Pending = 'PENDING',
    Done = 'DONE',
    Failed = 'FAILED',
}
type Jobs = {[jobId: string]: JobStatus}

const jobs: Jobs = {};

const validateJobExists = (id: string) => {
    if (!(id in jobs)) {
        throw new Error(ERR_UNKNOWN_JOB);
    }
};

export const startJob = () => {
    const id = crypto.randomBytes(3).toString('hex');

    jobs[id] = JobStatus.Pending;

    return id;
}

export const getJobStatus = (id: string) => {
    validateJobExists(id);

    return jobs[id];
};

export const updateJobStatus = (id: string, newStatus: JobStatus) => {
    validateJobExists(id);

    jobs[id] = newStatus;
}

