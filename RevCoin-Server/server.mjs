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
import Transaction from './models/Transaction.mjs';
import PubNubService from './pubnubServer.mjs';

dotenv.config({ path: './config/config.env' });

connectDB();

const blockchain = new Blockchain();
await blockchain.initialize();

const transactionPool = new TransactionPool();
const minerWallet = new Wallet();

const miner = new Miner({
  blockchain,
  transactionPool,
  wallet: minerWallet,
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

app.use('/api/v1/RevCoin/blockchain', blockchainRouter);
app.use('/api/v1/RevCoin/auth', authRouter);
app.use('/api/v1/RevCoin/transactions', transactionRouter);

app.listen(nodePort, () =>
  console.log(
    `Server is running on port: ${nodePort} in ${process.env.NODE_ENV} mode`
      .bgGreen
  )
);

export { blockchain, minerWallet, transactionPool, miner };
