import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import PubNubService from '../pubnubServer.mjs';
import { blockchain, transactionPool } from '../server.mjs';

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/v1/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  const { recipient, amount } = req.body;
  const senderWallet = new Wallet(req.user);

  try {
    const transaction = senderWallet.createTransaction({
      recipient,
      amount,
      blockchain,
    });

    transactionPool.setTransaction(transaction);
    PubNubService.publishToChannel('TRANSACTION', transaction);

    await transaction.save();

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const mineTransactions = async (req, res) => {
  try {
    const newBlock = await miner.mineTransactions();

    if (newBlock) {
      PubNubService.publishToChannel('BLOCKCHAIN', newBlock);
      res.status(201).json({ success: true, block: newBlock });
    } else {
      res.status(400).json({ success: false, message: 'No block was mined' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
