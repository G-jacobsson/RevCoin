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

const simulateTransactionsAndMining = async () => {
  const wallet1 = new Wallet();
  const wallet2 = new Wallet();

  try {
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

    console.log('Transaction 1:', transaction1);
    console.log('Transaction 2:', transaction2);

    if (
      !Transaction.validateTransaction(transaction1) ||
      !Transaction.validateTransaction(transaction2)
    ) {
      throw new Error('Invalid transaction');
    }

    transactionPool.setTransaction(transaction1);
    transactionPool.setTransaction(transaction2);

    console.log(
      'Transactions added to the pool:',
      transactionPool.transactionMap
    );

    const newBlock = await miner.mineTransactions();

    if (newBlock) {
      console.log('New block mined:', newBlock);
      PubNubService.publishToChannel('BLOCKCHAIN', newBlock);
    } else {
      console.log('No block was mined');
    }
  } catch (error) {
    console.error('Error in transactions or mining:', error);
  }
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
app.use('/api/v1/RevCoin/auth', authRouter);
app.use('/api/v1/RevCoin/transactions', transactionRouter);

app.listen(nodePort, () =>
  console.log(
    `Server is running on port: ${nodePort} in ${process.env.NODE_ENV} mode`
      .bgGreen
  )
);

export { blockchain, minerWallet };
