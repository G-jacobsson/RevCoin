import express from 'express';
import {
  getBlockchain,
  mineBlock,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.get('/', getBlockchain);
router.post('/mine', mineBlock);

export default router;
