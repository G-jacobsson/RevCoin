import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/revcoinApi';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      console.log('Login success', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('wallet', JSON.stringify(data.wallet));
      navigate('/transactions');
    } catch (error) {
      setError(error.message);
      console.error('Login Error', error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <h1 className="title">RevCoin</h1>
      <div className="login-page">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button
          onClick={handleRegisterRedirect}
          className="register-button"
        >
          Not registered? Sign up here
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
