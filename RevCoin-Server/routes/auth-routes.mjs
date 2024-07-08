import express from 'express';
import {
  register,
  login,
  getMe,
  resetPassword,
} from '../controllers/auth-controller.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
