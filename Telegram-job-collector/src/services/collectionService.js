import { logger } from '../utils/logger.js';

export const runHistoryCollection = async (collector) => {
    const summary = await collector.collectHistory();
    logger.info({ event: 'history_collection_summary', channels: summary }, 'History collection summary');
    return summary;
};
