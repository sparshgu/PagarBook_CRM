import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/staff', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-orb orb1" />
      <div className="login-orb orb2" />
      <div className="login-orb orb3" />

      <div className="login-card animate-in">
        <div className="login-brand">
          <div className="login-logo">
            <span className="logo-p">P</span>
          </div>
          <h1 className="login-title">PagarBook <span>CRM</span></h1>
          <p className="login-subtitle">Relationship Executive Portal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="apna username dalein"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Login karein'}
          </button>
        </form>

        {/* <div className="login-hints">
          <p>Demo Credentials:</p>
          <div className="hint-row"><span className="hint-role">Admin</span> admin / admin@123</div>
          <div className="hint-row"><span className="hint-role">Staff</span> rahul / rahul@123</div>
          <div className="hint-row"><span className="hint-role">Staff</span> priya / priya@123</div>
        </div> */}
      </div>
    </div>
  );
}
