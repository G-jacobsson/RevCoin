import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import Blockchain from './models/Blockchain.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';

dotenv.config({ path: './config/config.env' });

export const blockchain = new Blockchain();
console.log(blockchain);
const block = blockchain.addBlock({
  amount: 5,
  sender: 'Alice',
  recipient: 'Bob',
});
console.log(block);
console.log(blockchain);

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
