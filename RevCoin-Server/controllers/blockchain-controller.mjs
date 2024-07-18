import { blockchain, miner, transactionPool } from '../server.mjs';
import PubNubService from '../pubnubServer.mjs';
import Block from '../models/Block.mjs';

export const getBlockchain = async (req, res) => {
  try {
    const blocks = await Block.find().sort({ index: 1 });
    res.status(200).json({
      success: true,
      data: blocks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const mineBlock = async (req, res) => {
  try {
    const newBlock = await miner.mineTransactions();

    if (newBlock) {
      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });

      PubNubService.publishToChannel('BLOCKCHAIN', newBlock);
      res.status(201).json({
        success: true,
        data: newBlock,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No block was mined',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = (req, res) => {
  res.status(200).json({
    success: true,
    data: transactionPool.getTransactionList(),
  });
};
