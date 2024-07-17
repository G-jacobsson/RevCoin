import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';

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
  try {
    const { sender, recipient, amount } = req.body;

    const senderWallet = await Wallet.findOne({ publicKey: sender });
    const recipientWallet = await Wallet.findOne({ publicKey: recipient });

    if (!senderWallet || !recipientWallet) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid wallets' });
    }

    const transaction = senderWallet.createTransaction({
      recipient: recipientWallet.publicKey,
      amount,
      blockchain: req.blockchain,
    });

    await transaction.save();

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
