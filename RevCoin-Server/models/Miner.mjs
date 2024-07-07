// Miner.mjs

import { minerWallet } from '../server.mjs';
import Transaction from './Transaction.mjs';

export default class Miner {
  constructor({ blockchain, transactionPool, minerWallet, pubNubServer }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.minerWallet = minerWallet;
    this.pubNubServer = pubNubServer;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    if (validTransactions.length === 0) {
      console.log('No valid transactions to mine');
      return;
    }

    const rewardTransaction = this.createRewardTransaction();
    validTransactions.push(rewardTransaction);

    const block = this.blockchain.addBlock(validTransactions);

    // this.pubNubServer.broadcastChain();

    this.transactionPool.clear();

    return block;
  }

  createRewardTransaction() {
    const rewardTransaction = new Transaction({
      sender: minerWallet,
      recipient: minerWallet.publicKey,
      amount: 50,
    });

    return rewardTransaction;
  }
}
