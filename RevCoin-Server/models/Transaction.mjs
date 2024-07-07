import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utils/cipherHash.mjs';

export default class Transaction {
  constructor({ sender, recipient, amount, outputMap, inputMap }) {
    this.transactionId = this.createTransactionId();
    this.outputMap =
      outputMap || this.createOutputMap({ sender, recipient, amount });
    this.inputMap =
      inputMap ||
      this.createInputMap({ sender, amount, outputMap: this.outputMap });
  }

  createTransactionId() {
    return uuidv4().replaceAll('-', '');
  }

  createOutputMap({ sender, recipient, amount }) {
    const outputMap = {};

    const remainingBalance = sender.balance - amount;

    if (remainingBalance < 0) {
      throw new Error('Amount exceeds balance');
    }

    outputMap[sender.publicKey] = remainingBalance;
    outputMap[recipient] = amount;

    return outputMap;
  }

  createInputMap({ sender, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: sender.balance,
      address: sender.publicKey,
      signature: sender.sign(outputMap),
    };
  }

  static validateTransaction(transaction) {
    const {
      inputMap: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce(
      (total, amount) => total + amount,
      0
    );

    if (amount !== outputTotal) {
      console.log(
        'Invalid transaction: Output total does not match input amount'
      );
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.log('Invalid transaction: Signature verification failed');
      return false;
    }

    return true;
  }
}
