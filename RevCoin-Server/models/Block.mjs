import { generateHash } from '../utils/cipherHash.mjs';

export default class Block {
  constructor(index, previousHash, timestamp, data, nonce, difficulty) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || +process.env.DIFFICULTY;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return generateHash(
      this.index,
      this.previousHash,
      this.timestamp,
      JSON.stringify(this.data),
      this.nonce,
      this.difficulty
    );
  }
}
