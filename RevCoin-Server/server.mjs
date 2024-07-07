import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import Blockchain from './models/Blockchain.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import Wallet from './models/Wallet.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Miner from './models/Miner.mjs';

dotenv.config({ path: './config/config.env' });

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const minerWallet = new Wallet();

const miner = new Miner({
  blockchain,
  transactionPool,
  wallet: minerWallet,
});

const simulateTransactionsAndMining = async () => {
  const wallet1 = new Wallet();
  const wallet2 = new Wallet();

  const transaction1 = wallet1.createTransaction({
    recipient: wallet2.publicKey,
    amount: 10,
    blockchain,
  });

  const transaction2 = wallet2.createTransaction({
    recipient: wallet1.publicKey,
    amount: 5,
    blockchain,
  });

  transactionPool.addTransaction(transaction1);
  transactionPool.addTransaction(transaction2);

  const newBlock = miner.mineTransactions();

  console.log('New block mined:', newBlock);
};

simulateTransactionsAndMining();

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

app.listen(nodePort, () =>
  console.log(
    `Server is running on port: ${nodePort} in ${process.env.NODE_ENV} mode`
      .bgGreen
  )
);
