import express from 'express';
import {
  scheduleInterview,
  listInterviews,
  myInterviews,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(protect, requireRole('admin', 'hr'), scheduleInterview)
  .get(protect, requireRole('admin', 'hr'), listInterviews);

router.get('/me', protect, requireRole('candidate'), myInterviews);

router
  .route('/:id')
  .put(protect, requireRole('admin', 'hr'), updateInterview)
  .delete(protect, requireRole('admin', 'hr'), deleteInterview);

export default router;
