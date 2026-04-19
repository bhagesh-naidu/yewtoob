/* src/pages/Login.js */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login }     = useAuth();
  const navigate       = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await loginApi(form);
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-card__logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#ff2b2b"/>
            <polygon points="12,9 25,16 12,23" fill="white"/>
          </svg>
          <span>YewToob</span>
        </div>

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__sub">Sign in to continue watching</p>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-card__switch">
          No account? <Link to="/signup">Create one</Link>
        </p>

        {/* Demo credentials hint */}
        <div className="auth-card__hint">
          <strong>Demo account:</strong><br />
          admin@yewtoob.com / password123
        </div>
      </div>
    </div>
  );
}
