// models/Miner.mjs
import { minerWallet } from '../server.mjs';
import Transaction from './Transaction.mjs';
import Blockchain from './Blockchain.mjs';

export default class Miner {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.minerWallet = wallet;
  }

  async mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    if (validTransactions.length === 0) {
      console.log('No valid transactions to mine');
      return;
    }

    const rewardTransaction = this.createRewardTransaction();
    validTransactions.push(rewardTransaction);

    const block = await this.blockchain.addBlock(validTransactions);

    // this.pubNubServer.broadcastChain();

    this.transactionPool.clear();

    return block;
  }

  createRewardTransaction() {
    const rewardTransaction = new Transaction({
      sender: 'MINER_REWARD',
      recipient: minerWallet.publicKey,
      amount: 50,
    });

    return rewardTransaction;
  }
}
