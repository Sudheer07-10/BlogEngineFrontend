import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('blog_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection refused. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-workspace)',
      padding: '20px'
    }}>
      <div className="card-minimal animate-fadeIn" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '48px', 
        textAlign: 'center',
        boxShadow: '0 32px 64px rgba(0,0,0,0.08)'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--accent-orange)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '1.5rem',
            color: 'white',
            transform: 'rotate(10deg)',
            boxShadow: '0 12px 24px rgba(255, 107, 63, 0.3)'
          }}>
            🚀
          </div>
          <h1 className="heading-lg" style={{ fontSize: '2rem', marginBottom: '8px' }}>BlogEngine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue to your dashboard</p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '24px', 
            borderRadius: '12px', 
            background: 'rgba(239, 68, 68, 0.05)', 
            color: '#ef4444', 
            fontSize: '0.8rem', 
            border: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '24px' }}>
            <label className="premium-label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              className="premium-input-minimal" 
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label className="premium-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              className="premium-input-minimal" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary-minimal" 
            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-orange)', fontWeight: '700', textDecoration: 'none' }}>Get Started</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
