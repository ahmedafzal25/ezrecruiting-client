import express from 'express';
import {
  applyToJob,
  myApplications,
  listAllApplications,
  getApplication,
  updateApplicationStatus,
  sendCustomMessage
} from '../controllers/applicationController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(protect, requireRole('candidate'), applyToJob)
  .get(protect, requireRole('admin', 'hr'), listAllApplications);

router.get('/me', protect, requireRole('candidate'), myApplications);

router.get('/:id', protect, getApplication);

router.put('/:id/status', protect, requireRole('admin', 'hr'), updateApplicationStatus);
router.post('/:id/message', protect, requireRole('admin', 'hr'), sendCustomMessage);

export default router;
