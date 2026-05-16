import express from 'express';
import {
  uploadResumeFile,
  uploadProfileImage
} from '../controllers/uploadController.js';
import { uploadResume, uploadImage } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/resume', protect, uploadResume.single('file'), uploadResumeFile);
router.post('/image', protect, uploadImage.single('file'), uploadProfileImage);

export default router;
