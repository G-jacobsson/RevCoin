import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import connectDB from './config/mongoDb.mjs';
import Blockchain from './models/Blockchain.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import authRouter from './routes/auth-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import Wallet from './models/Wallet.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Miner from './models/Miner.mjs';
import PubNubService from './pubnubServer.mjs';
import User from './models/User.mjs';
import jwt from 'jsonwebtoken';

dotenv.config({ path: './config/config.env' });

connectDB();

const blockchain = new Blockchain();
await blockchain.initialize();

const transactionPool = new TransactionPool();

const miner = new Miner({
  blockchain,
  transactionPool,
});

PubNubService.subscribeToChannel('BLOCKCHAIN');
PubNubService.subscribeToChannel('TRANSACTION');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = +process.env.PORT || 5010;
const PRIMARY_NODE = `http://localhost:${PORT}`;

let nodePort =
  process.env.DYNAMIC_NODE_PORT === 'true'
    ? PORT + Math.floor(Math.random() * 1000)
    : PORT;

const fetchUserAndInitializeWallet = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.wallet = new Wallet(user);
    next();
  } catch (error) {
    console.error('Error initializing wallet:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

app.use('/api/v1/RevCoin/blockchain', blockchainRouter);
app.use('/api/v1/RevCoin/auth', authRouter);
app.use(
  '/api/v1/RevCoin/transactions',
  fetchUserAndInitializeWallet,
  transactionRouter
);

const syncBlockchain = async () => {
  if (process.env.DYNAMIC_NODE_PORT === 'true') {
    try {
      const response = await fetch(`${PRIMARY_NODE}/api/v1/RevCoin/blockchain`);
      const data = await response.json();
      if (data) {
        blockchain.syncChains(data.data);
        console.log('Blockchain synchronized with primary node');
        console.log('Blockchain:', blockchain.chain);
      } else {
        console.error('Failed to synchronize blockchain');
      }
    } catch (error) {
      console.error('Error synchronizing blockchain:', error.message);
    }
  }
};

app.listen(nodePort, async () => {
  console.log(
    `Server is running on port: ${nodePort} in ${process.env.NODE_ENV} mode`
      .bgGreen
  );
  await syncBlockchain();
});

export { blockchain, transactionPool, miner };
