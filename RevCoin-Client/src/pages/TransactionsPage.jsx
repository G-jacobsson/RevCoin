import React, { useState, useEffect } from 'react';
import { fetchTransactions, createTransaction } from '../services/revcoinApi';
import '../styles/TransactionPage.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await fetchTransactions();
      setTransactions(data);
    };

    loadTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = await createTransaction({
      sender,
      recipient,
      amount,
    });
    setTransactions([...transactions, newTransaction]);
    setSender('');
    setRecipient('');
    setAmount('');
  };

  return (
    <div className="container">
      <h1>Transactions</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sender">Sender</label>
        <input
          id="sender"
          type="text"
          placeholder="Sender's Public Key"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          required
        />
        <label htmlFor="recipient">Recipient</label>
        <input
          id="recipient"
          type="text"
          placeholder="Recipient's Public Key"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="Amount to Transfer"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Create Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            <div className="transaction-details">
              <div className="wallet-address">Sender: {transaction.sender}</div>
              <div className="wallet-address">
                Recipient: {transaction.recipient}
              </div>
            </div>
            <div className="amounts">
              <span className="sent">Sent: {transaction.amount}</span>
              <span className="remaining">
                Remaining: {transaction.inputMap.amount - transaction.amount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
