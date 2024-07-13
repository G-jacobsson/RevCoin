import mongoose from 'mongoose';
import { generateHash, verifySignature } from '../utils/cipherHash.mjs';

const transactionSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  outputMap: {
    type: Map,
    of: Number,
    required: true,
  },
  inputMap: {
    timestamp: {
      type: Number, // Changed from Date to Number
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
  },
});

transactionSchema.methods.createOutputMap = function () {
  const outputMap = new Map();
  outputMap.set(this.recipient, this.amount);
  outputMap.set(this.sender, this.inputMap.amount - this.amount); // Include sender's remaining balance
  return outputMap;
};

transactionSchema.methods.createInputMap = function ({
  senderWallet,
  outputMap,
}) {
  return {
    timestamp: Date.now(),
    amount: senderWallet.balance,
    address: senderWallet.publicKey,
    signature: senderWallet.sign([...outputMap.entries()]),
  };
};

transactionSchema.statics.validateTransaction = function (transaction) {
  const {
    inputMap: { address, amount, signature },
    outputMap,
  } = transaction;
  const outputTotal = Array.from(outputMap.values()).reduce(
    (total, value) => total + value,
    0
  );

  // Add detailed logging
  console.log(`Validating transaction from ${address}:`);
  console.log(`Amount: ${amount}`);
  console.log(`Output Map:`, Array.from(outputMap.entries()));
  console.log(`Output Total: ${outputTotal}`);

  if (amount !== outputTotal) {
    console.error(
      `Invalid transaction from ${address}: amount does not equal output total.`
    );
    return false;
  }

  if (
    !verifySignature({
      publicKey: address,
      data: [...outputMap.entries()],
      signature,
    })
  ) {
    console.error(`Invalid signature from ${address}.`);
    return false;
  }

  return true;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
