import { Router } from 'express';
import { importBulkJobs, importSingleJob } from '../controllers/jobImport.controller.js';

const router = Router();
router.post('/import', importSingleJob);
router.post('/import/bulk', importBulkJobs);
export default router;
