import { createEllipticHash, generateHash } from '../utils/cipherHash.mjs';
import Transaction from './Transaction.mjs';

export default class Wallet {
  constructor() {
    this.balance = +process.env.INITIAL_WALLET_BALANCE;
    this.keyPair = createEllipticHash.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  static calculateBalance({ blockchain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i = blockchain.chain.length - 1; i > 0; i--) {
      const block = blockchain.chain[i];

      for (let transaction of block.data) {
        if (transaction.inputMap && transaction.inputMap.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal += addressOutput;
        }
      }

      if (hasConductedTransaction) break;

      return hasConductedTransaction
        ? outputsTotal
        : +process.env.INITIAL_WALLET_BALANCE + outputsTotal;
    }
  }

  sign(data) {
    return this.keyPair.sign(generateHash(data));
  }

  createTransaction({ recipient, amount, blockchain }) {
    if (blockchain) {
      this.balance = Wallet.calculateBalance({
        blockchain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance');
    }

    return new Transaction({
      sender: this,
      recipient,
      amount,
    });
  }
}
