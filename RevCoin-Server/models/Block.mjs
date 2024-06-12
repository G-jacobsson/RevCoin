import { createHash } from '../utils/cipherHash.mjs';

export default class Block {
  constructor(index, timestamp, data, difficulty, nonce, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return createHash(
      this.index,
      this.timestamp,
      JSON.stringify(this.data),
      this.difficulty,
      this.nonce,
      this.previousHash
    );
  }
}
