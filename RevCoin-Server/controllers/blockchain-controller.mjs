import { blockchain } from '../server.mjs';

export const getBlockchain = (req, res) => {
  res.status(200).json({
    success: true,
    data: blockchain.chain,
  });
};

export const mineBlock = async (req, res) => {
  const { transactions } = req.body;
  try {
    const newBlock = await blockchain.addBlock(transactions);
    res.status(201).json({
      success: true,
      data: newBlock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
