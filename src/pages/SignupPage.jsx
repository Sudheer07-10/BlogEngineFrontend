import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    platform: 'cp_blogs'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('blog_user', JSON.stringify(data.user));
        navigate('/onboarding');
      } else {
        setError(data.detail || 'Signup failed. Please try again.');
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
        maxWidth: '480px', 
        padding: '48px', 
        boxShadow: '0 32px 64px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--bg-sidebar)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            🎒
          </div>
          <h1 className="heading-lg" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the Blog Engine ecosystem</p>
        </div>

        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '24px', 
            borderRadius: '12px', 
            background: 'rgba(239, 68, 68, 0.05)', 
            color: '#ef4444', 
            fontSize: '0.8rem', 
            textAlign: 'center',
            border: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label className="premium-label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              className="premium-input-minimal" 
              placeholder="alex@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
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

          <div style={{ marginBottom: '32px' }}>
            <label className="premium-label" style={{ display: 'block', marginBottom: '8px' }}>Target Platform</label>
            <select 
              className="premium-input-minimal" 
              style={{ width: '100%', appearance: 'none', background: 'white', height: '52px' }}
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            >
              <option value="cp_blogs">🎓 Course Platform (CP)</option>
              <option value="sakhi_blogs">👩 Janmasethu (Sakhi)</option>
              <option value="jobs_blogs">💼 Job Board (Jobs)</option>
              <option value="oa_blogs">🏫 Ottobon Academy</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary-minimal" 
            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Get Started ✨'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/" style={{ color: 'var(--accent-orange)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
