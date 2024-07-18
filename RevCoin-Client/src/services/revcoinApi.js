const BASE_URL = 'http://localhost:5001/api/v1/RevCoin';

export const register = async (name, email, password, role = 'user') => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials, try again or register a new account');
  }

  return response.json();
};

export const fetchTransactions = async () => {
  const response = await fetch(`${BASE_URL}/transactions`);
  const data = await response.json();
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
};

export const createTransaction = async ({ recipient, amount }) => {
  const response = await fetch(`${BASE_URL}/transactions/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ recipient, amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create transaction');
  }

  const result = await response.json();
  return result.data; // Return the data object
};

export const mineTransactions = async () => {
  const response = await fetch(`${BASE_URL}/blockchain/mine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response:', errorData);
    throw new Error(errorData.message || 'Failed to mine transactions');
  }

  return response.json();
};

export const fetchBlocks = async () => {
  const response = await fetch(`${BASE_URL}/blockchain`);
  const data = await response.json();
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
};
