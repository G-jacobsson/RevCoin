import { generateHash } from '../utils/cipherHash.mjs';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';
import TransactionPool from './TransactionPool.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [this.genesisBlock()];
    this.transactionPool = new TransactionPool();
    this.pendingTransactions = [];
  }

  genesisBlock() {
    return new Block(
      0,
      '0',
      Date.now(),
      'Genesis Block',
      0,
      +process.env.DIFFICULTY
    );
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(previousHash, data) {
    const latestBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 1024;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.difficultyAdjustment(latestBlock, timestamp);

      hash = generateHash(
        latestBlock.index + 1,
        previousHash,
        timestamp,
        JSON.stringify(data),
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, difficulty, timestamp, hash };
  }

  difficultyAdjustment(latestBlock, timestamp) {
    const MINE_RATE = +process.env.MINE_RATE;
    let { difficulty } = latestBlock;
    const timeTaken = timestamp - latestBlock.timestamp;

    if (difficulty < 1) return 1;

    return timeTaken > MINE_RATE ? difficulty + 1 : difficulty - 1;
  }

  addBlock(transactions) {
    const lastBlock = this.getLastBlock();
    const { nonce, difficulty, timestamp, hash } = this.proofOfWork(
      lastBlock.hash,
      transactions
    );

    const newBlock = new Block(
      lastBlock.index + 1,
      lastBlock.hash,
      timestamp,
      transactions,
      nonce,
      difficulty
    );

    newBlock.hash = hash;
    this.chain.push(newBlock);
    return newBlock;
  }

  minePendingTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    if (validTransactions.length === 0) {
      throw new Error('No valid transactions to mine');
    }

    const rewardTransaction = this.createRewardTransaction();
    validTransactions.push(rewardTransaction);

    const block = this.addBlock(validTransactions);
    this.transactionPool.clear();
    return block;
  }

  addTransaction(transaction) {
    if (!Transaction.validateTransaction(transaction)) {
      throw new Error('Invalid transaction');
    }

    this.transactionPool.setTransaction(transaction);
  }

  syncChains(newChain) {
    if (newChain.length <= this.chain.length) {
      throw new Error('Received chain is not longer than current chain');
    }

    if (!this.validateChain(newChain)) {
      throw new Error('Received chain is invalid');
    }

    this.chain = newChain;
    this.transactionPool.clearBlockchainTransactions({ chain: newChain });
  }

  validateChain(chain) {
    // Implement validation logic for the entire chain
  }
}
