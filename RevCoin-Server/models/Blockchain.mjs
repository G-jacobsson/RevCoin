import Block from './Block.mjs';
import { generateHash } from '../utils/cipherHash.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [this.genesisBlock()];
  }

  genesisBlock() {
    return {
      index: 0,
      timestamp: 1,
      data: 'Genesis Block',
      difficulty: +process.env.DIFFICULTY,
      hash: '0',
    };
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transactions) {
    const lastBlock = this.getLastBlock();
    const { nonce, difficulty, timestamp, hash } = this.proofOfWork(
      lastBlock.hash,
      transactions
    );

    const newBlock = new Block(
      lastBlock.index + 1,
      timestamp,
      transactions,
      difficulty,
      nonce,
      lastBlock.hash
    );

    newBlock.hash = hash;
    this.chain.push(newBlock);
    return newBlock;
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
}
