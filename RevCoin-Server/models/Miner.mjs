export default class Miner {
  constructor({ blockchain, transactionPool, wallet, pubNubServer }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
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
      senderWallet: { publicKey: 'system' },
      recipient: this.wallet.publicKey,
      amount: 50,
    });
    return rewardTransaction;
  }
}
