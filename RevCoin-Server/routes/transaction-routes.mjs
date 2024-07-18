import express from 'express';
import {
  getTransactions,
  createTransaction,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';
import { protect } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.route('/').get(getTransactions);
router.route('/create').post(protect, createTransaction);
router.route('/mine').post(protect, mineTransactions);

export default router;
