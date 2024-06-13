import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [this.genesisBlock()];
  }

  genesisBlock() {
    return {
      index: 0,
      timestamp: Date.now(),
      data: 'Genesis Block',
      difficulty: +process.env.DIFFICULTY,
      hash: '0',
    };
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  addBlock(transaction) {
    const lastBlock = this.getLastBlock();
    const nonce = 0;
    const block = new Block(
      lastBlock.index + 1,
      Date.now(),
      transaction,
      lastBlock.difficulty,
      nonce,
      lastBlock.hash
    );

    this.chain.push(block);
    return block;
  }
}
