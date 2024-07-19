import { createEllipticHash, generateHash } from '../utils/cipherHash.mjs';
import Transaction from './Transaction.mjs';

export default class Wallet {
  constructor(user = null) {
    if (user && user.wallet) {
      this.keyPair = createEllipticHash.keyFromPrivate(
        user.wallet.privateKey,
        'hex'
      );
      this.publicKey = this.keyPair.getPublic().encode('hex');
      this.balance = user.wallet.balance;
    } else {
      this.keyPair = createEllipticHash.genKeyPair();
      this.publicKey = this.keyPair.getPublic().encode('hex');
      this.balance = +process.env.INITIAL_WALLET_BALANCE;
    }
  }

  static calculateBalance({ blockchain, transactionPool, address }) {
    let balance = +process.env.INITIAL_WALLET_BALANCE;
    let hasConductedTransaction = false;

    console.log(`Calculating balance for address: ${address}`);

    for (let i = blockchain.chain.length - 1; i > 0; i--) {
      const block = blockchain.chain[i];
      console.log(`Checking block: ${block.hash}`);

      for (let transaction of block.data) {
        console.log(`Checking transaction: ${transaction._id}`);

        if (transaction.inputMap && transaction.inputMap.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap.get(address);
        if (addressOutput !== undefined) {
          balance = addressOutput;
          console.log(`Found output for address ${address}: ${addressOutput}`);
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    for (let transaction of Object.values(transactionPool.transactionMap)) {
      console.log(`Checking transaction in pool: ${transaction._id}`);

      if (transaction.inputMap && transaction.inputMap.address === address) {
        hasConductedTransaction = true;
      }

      const addressOutput = transaction.outputMap.get(address);
      if (addressOutput !== undefined) {
        balance = addressOutput;
        console.log(
          `Found output in pool for address ${address}: ${addressOutput}`
        );
      }
    }

    console.log(`Final calculated balance for address ${address}: ${balance}`);
    return balance;
  }

  sign(data) {
    return this.keyPair.sign(generateHash(data)).toDER('hex');
  }

  createTransaction({ recipient, amount, blockchain, transactionPool }) {
    console.log(
      `Creating transaction from ${this.publicKey} to ${recipient} for amount ${amount}`
    );

    this.balance = Wallet.calculateBalance({
      blockchain,
      transactionPool,
      address: this.publicKey,
    });

    console.log(`Balance after calculation: ${this.balance}`);

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
    outputMap.set(this.publicKey, this.balance - amount);
    transaction.outputMap = outputMap;

    transaction.inputMap = transaction.createInputMap({
      senderWallet: this,
      outputMap: transaction.outputMap,
    });

    console.log(
      `Transaction created with outputMap: ${JSON.stringify([
        ...outputMap.entries(),
      ])}`
    );
    return transaction;
  }
}
