import request from 'supertest';
import app from '../app';
import { ERR_UNKNOWN_JOB } from '../src/errors';

jest.mock('../src/jobsModel');

import { JobStatus, getJobStatus } from '../src/jobsModel';

const mockGetJobStatus = getJobStatus as jest.MockedFunction<(id: string) => JobStatus>;

describe('status route', () => {
    it('responds with 200 and status DONE for done jobs', async () => {
        mockGetJobStatus.mockImplementation(() => JobStatus.Done);

        await request(app)
            .get('/status?id=sfdxgx')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe(JobStatus.Done)
            });
    });

    it('responds with 200 and status PENDING for pending jobs', async () => {
        mockGetJobStatus.mockImplementation(() => JobStatus.Pending);

        await request(app)
        .get('/status?id=sfdxgx')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe(JobStatus.Pending)
            });
    });

    it('responds with 400 if job is unknown', async () => {
        mockGetJobStatus.mockImplementation(() => { throw new Error(ERR_UNKNOWN_JOB) });

        await request(app)
            .get('/status?id=sfdxgx')
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.text).toBe("Cannot find a job with 'sfdxgx' id")
            });
    });

    it('responds with 500 if jobs model throws some unexpected error', async () => {
        mockGetJobStatus.mockImplementation(() => { throw new Error('something happened') });

        await request(app)
            .get('/status?id=sfdxgx')
            .then(response => {
                expect(response.statusCode).toBe(500);
                expect(response.text).toBe('Something went wrong')
            });
    });
});
