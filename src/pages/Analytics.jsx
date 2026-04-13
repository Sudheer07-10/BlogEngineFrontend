import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('blog_user'));
    setUser(storedUser);
    
    const fetchAnalytics = async () => {
      try {
        const platform = storedUser?.platform?.split('_')[0] || 'cp';
        const res = await fetch(`${API_URL}/api/analytics?platform=${platform}`);
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const handleApplySuggestion = async () => {
    if (!analytics?.learning_signal || !user?.id) return;
    setApplying(true);
    try {
      const res = await fetch(`${API_URL}/api/analytics/apply-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          suggestion: analytics.learning_signal
        })
      });
      if (res.ok) {
        alert('AI Suggestion Applied! Your persona has been refined. ✨');
      }
    } catch (err) {
      console.error('Failed to apply suggestion:', err);
    } finally {
      setApplying(false);
    }
  };

  const performanceStats = [
    { label: 'Click-Through Rate', value: analytics?.ctr || '0%', icon: '🖱️' },
    { label: 'Total Site Hits', value: analytics?.site_views || '0', icon: '🌍' },
    { label: 'Unique Visitors', value: analytics?.unique_visitors || '0', icon: '👤' },
    { label: 'Avg. Read Time', value: analytics?.read_time || '0:00', icon: '📖' } 
  ];

  if (loading) {
    return <Layout><div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing performance loops...</div></Layout>;
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <header style={{ marginBottom: '40px' }}>
          <h2 className="heading-lg">Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Visualizing your engine's growth and audience resonance.</p>
        </header>



        {/* Performance Grid: Stats Cards */}
        <div className="stats-grid-minimal">
          {performanceStats.map(s => (
            <div key={s.label} className="stat-card-minimal">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '4px 8px', background: 'var(--bg-highlight)', color: 'var(--accent-orange)', borderRadius: '100px' }}>
                  LIVE
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{s.value}</h3>
            </div>
          ))}
        </div>
        
        {/* Universal Tracker Section */}
        <div className="card-minimal" style={{ marginTop: '48px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px' }}>🛰️ Universal Site Tracker</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            To track analytics for your entire domain, paste this script into the <code>&lt;head&gt;</code> of your website.
          </p>
          
          <div style={{ position: 'relative' }}>
            <pre style={{ 
              background: '#0a0a0a', 
              color: '#00ff00', 
              padding: '24px', 
              borderRadius: '16px', 
              fontSize: '0.8rem', 
              overflowX: 'auto',
              fontFamily: 'monospace',
              border: '1px solid #333'
            }}>
{`<script>
  // Universal Analytics for ${user?.platform?.split('_')[0].toUpperCase()}
  (function() {
    const platform = "${user?.platform?.split('_')[0] || 'cp'}";
    fetch("${API_URL}/api/track/site?platform=" + platform + "&url=" + encodeURIComponent(window.location.href), {
      method: "POST", mode: "no-cors"
    });
  })();
</script>`}
            </pre>
            <button 
              onClick={() => {
                const code = `<script>\n  (function() {\n    const platform = "${user?.platform?.split('_')[0] || 'cp'}";\n    fetch("${API_URL}/api/track/site?platform=" + platform + "&url=" + encodeURIComponent(window.location.href), {\n      method: "POST", mode: "no-cors"\n    });\n  })();\n</script>`;
                navigator.clipboard.writeText(code);
                alert('Tracker script copied to clipboard!');
              }}
              style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', background: '#333', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Copy Script
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
