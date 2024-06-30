import { v4 as uuidv4 } from 'uuid';

export default class Transaction {
  constructor({ sender, recipient, amount, outputMap, inputMap }) {
    this.transactionId = this.createTransactionId(transactionId);
    this.outputMap =
      outputMap || this.createOutputMap({ sender, recipient, amount });
    this.inputMap = inputMap || this.createInputMap({ sender, outputMap });
  }

  createTransactionId(transactionId) {
    return transactionId || uuidv4().replaceAll('-', '');
  }

  createOutputMap({ sender, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[sender.publicKey] = sender.balance - amount;

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
}
