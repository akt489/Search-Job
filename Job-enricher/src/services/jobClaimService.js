import { claimPendingJobs, recoverStaleJobs } from '../db/jobRepository.js';

export const recoverAndClaim = async ({ staleTimeoutMs, batchSize }) => {
    const recovered = await recoverStaleJobs(staleTimeoutMs);
    const jobs = await claimPendingJobs(batchSize);
    return { recovered, jobs };
};
