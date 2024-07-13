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

        const addressOutput = transaction.outputMap.get(address);
        if (addressOutput !== undefined) {
          outputsTotal += addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction
      ? outputsTotal
      : +process.env.INITIAL_WALLET_BALANCE + outputsTotal;
  }

  sign(data) {
    return this.keyPair.sign(generateHash(data)).toDER('hex');
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

    const transaction = new Transaction({
      sender: this.publicKey,
      recipient,
      amount,
    });

    const outputMap = new Map();
    outputMap.set(recipient, amount);
    outputMap.set(this.publicKey, this.balance - amount); // Include sender's remaining balance
    transaction.outputMap = outputMap;

    transaction.inputMap = transaction.createInputMap({
      senderWallet: this,
      outputMap: transaction.outputMap,
    });

    return transaction;
  }
}
