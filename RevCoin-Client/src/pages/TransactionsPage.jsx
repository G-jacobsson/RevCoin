import React, { useState, useEffect } from 'react';
import { fetchTransactions, createTransaction } from '../services/revcoinApi';

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
  };

  return (
    <div>
      <h1>Transactions</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
        <input
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Create Transaction</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.sender} sent {transaction.amount} to{' '}
            {transaction.recipient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
