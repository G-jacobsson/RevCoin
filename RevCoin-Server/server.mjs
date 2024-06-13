import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import Blockchain from './models/Blockchain.mjs';

dotenv.config({ path: './config/config.env' });

export const blockchain = new Blockchain();
console.log(blockchain);
const block = blockchain.addBlock({
  amount: 5,
  sender: 'Alice',
  recipient: 'Bob',
});
console.log(block);

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5010;

app.listen(PORT, () =>
  console.log(
    `Server is running on port: ${PORT} in ${process.env.NODE_ENV} mode`.bgGreen
  )
);
