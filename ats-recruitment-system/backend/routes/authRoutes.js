import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  createAdmin,
  updateMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/setup-admin', createAdmin);

export default router;
