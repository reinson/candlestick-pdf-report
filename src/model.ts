import crypto from 'crypto';

enum Status {
    Pending,
    Done,
    Failed
}
type Jobs = {[jobId: string]: Status}

const jobs: Jobs = {};

const validateJobExists = (id: string) => {
    if (!jobs[id]) {
        throw new Error('Unknown job');
    }
};

export const startJob = () => {
    const id = crypto.randomBytes(3).toString('hex');

    jobs[id] = Status.Pending;

    return id;
}

export const getJobStatus = (id: string) => {
    validateJobExists(id);

    return jobs[id];
};

export const updateJobStatus = (id: string, newStatus: Status) => {
    validateJobExists(id);

    jobs[id] = newStatus;
}

