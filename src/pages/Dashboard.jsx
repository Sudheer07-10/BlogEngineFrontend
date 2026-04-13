import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ReachPie from '../components/ReachPie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: 'Published Posts', value: '0', icon: '📝', change: 'Calculating...' },
    { label: 'Average Engagement', value: '0%', icon: '🔥', change: 'Calculating...' },
    { label: 'Pipeline Queue', value: '0', icon: '⚡', change: 'Calculating...' },
    { label: 'Total Reach', value: '0', icon: '☁️', change: 'Calculating...' }
  ]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('cp_blogs');
  const [user, setUser] = useState(null);

  const platforms = [
    { id: 'oa_blogs', label: '🏫 Ottobon Academy' },
    { id: 'sakhi_blogs', label: '⚖️ Janmasethu' },
    { id: 'cp_blogs', label: '🎓 Course Platform' },
    { id: 'jobs_blogs', label: '💼 Jobs' }
  ];

  // Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('blog_user'));
    setUser(storedUser);
    if (storedUser?.platform) {
      setSelectedPlatform(storedUser.platform);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const platformParam = `?platform=${selectedPlatform.split('_')[0]}`;
        const resStats = await fetch(`${API_URL}/api/stats${platformParam}`);
        if (resStats.ok) {
          const data = await resStats.json();
          setStats(data);
        }
        const resActivity = await fetch(`${API_URL}/api/activity${platformParam}`);
        if (resActivity.ok) {
          const actData = await resActivity.json();
          setActivities(actData);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPlatform) {
      fetchDashboardData();
    }
  }, [selectedPlatform]);

  const handlePlatformChange = (newPlatform) => {
    setSelectedPlatform(newPlatform);
    const updatedUser = { ...user, platform: newPlatform };
    localStorage.setItem('blog_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 className="heading-lg">Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Tracking your <strong>{selectedPlatform.replace('_blogs', '').toUpperCase()}</strong> blog engine.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <span className="premium-label" style={{ marginBottom: 0, fontSize: '0.65rem' }}>Network</span>
            <select 
              className="premium-select"
              style={{ border: 'none', background: 'transparent', fontWeight: '800', padding: '4px 8px', height: 'auto', width: 'auto' }}
              value={selectedPlatform}
              onChange={(e) => handlePlatformChange(e.target.value)}
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid-minimal">
          {stats.map(s => (
            <div key={s.label} className="stat-card-minimal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '4px 8px', background: 'var(--bg-highlight)', color: 'var(--accent-orange)', borderRadius: '100px' }}>
                  NEW
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* Recent Activity List */}
          <div className="card-minimal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Activity</h3>
              <button 
                onClick={() => navigate('/pipeline')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-orange)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                View Pipeline ➔
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Loading insights...</p>
              ) : activities.map((activity, i) => (
                <div 
                  key={i} 
                  onClick={() => { setSelectedPost(activity); setIsPreviewOpen(true); }}
                  className="activity-row-interactive"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px 20px', 
                    borderRadius: 'var(--radius-small)', 
                    border: '1px solid var(--border-light)',
                    background: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: activity.type === 'Published' ? 'var(--bg-sidebar)' : 'var(--bg-highlight)', 
                      borderRadius: 'var(--radius-small)', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {activity.type === 'Published' ? '🚀' : '⏳'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{activity.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatTimeAgo(activity.time)} • {activity.type}</p>
                        {activity.url && (
                          <a href={activity.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: '700' }}>
                             🔗 Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {activity.type === 'Published' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '800', fontSize: '0.8rem' }}>{activity.views || 0} views</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{activity.clicks || 0} clicks</p>
                      </div>
                      <ReachPie views={activity.views} clicks={activity.clicks} size={32} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active Vibe Sidebar */}
          <div className="card-minimal" style={{ textAlign: 'center', background: 'var(--bg-sidebar)', color: 'white' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✨</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Active Vibe Profile</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Your engine is currently optimized for these styles.</p>
            
            <div style={{ margin: '24px 0', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-small)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '8px', opacity: 0.5 }}>TUNED STYLES</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                {user?.config?.vibes?.map(v => (
                  <span key={v} style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-orange)' }}>
                    #{v.replace(/^#/, '').toUpperCase()}
                  </span>
                ))}
                {(user?.config?.vibes?.length === 0 || !user?.config?.vibes) && (
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>No vibes set</span>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigate('/onboarding')}
              className="btn-primary-minimal"
              style={{ width: '100%', background: 'white', color: 'black' }}
            >
              Update Settings
            </button>
          </div>
        </div>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {isPreviewOpen && selectedPost && (
        <div className="modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="modal-content-card animate-fadeIn" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsPreviewOpen(false)}>✕</button>
            
            <div style={{ marginBottom: '32px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-orange)', background: 'var(--bg-highlight)', padding: '6px 12px', borderRadius: '100px', display: 'inline-block', marginBottom: '12px' }}>
                {selectedPost.type.toUpperCase()} PREVIEW
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: 1.2 }}>{selectedPost.title}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {selectedPost.type === 'Published' ? `Published ${formatTimeAgo(selectedPost.time)}` : `Scheduled for ${new Date(selectedPost.time).toLocaleString()}`}
              </p>
            </div>

            {selectedPost.image_url && (
              <img 
                src={selectedPost.image_url} 
                alt="Post Preview" 
                style={{ width: '100%', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }} 
              />
            )}

            <div style={{ padding: '32px', background: 'var(--bg-highlight)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', position: 'relative' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '12px', opacity: 0.5, letterSpacing: '0.1em' }}>SUMMARY</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '20px' }}>
                {selectedPost.summary || "No summary available for this entry."}
              </p>
              
              {selectedPost.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px dashed var(--border-light)', paddingTop: '12px' }}>
                  <a 
                    href={selectedPost.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="source-link"
                    style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-orange)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Original Source ➔
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedPost.hashtags?.map(tag => (
                <span key={tag} className="hashtag-pill">
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>

            {/* --- SHARE BAR --- */}
            <div className="share-bar" style={{ marginTop: '32px' }}>
               <div className="share-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <span className="share-label" style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.6 }}>Share:</span>
                 <button 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/card/${selectedPost.id}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                  }} 
                  className="share-icon" title="Twitter (X)" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                 >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                 </button>
                 <button 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/card/${selectedPost.id}`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                  }} 
                  className="share-icon" title="Facebook" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                 >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </button>
                 <button 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/card/${selectedPost.id}`;
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                  }} 
                  className="share-icon" title="LinkedIn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                 >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.981 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/></svg>
                 </button>
               </div>
            </div>

            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                 <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5 }}>VIEWS</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '800' }}>{selectedPost.views || 0}</p>
                 </div>
                 <div>
                    <p style={{ fontSize: '0.7rem', fontWeight: '800', opacity: 0.5 }}>CLICKS</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '800' }}>{selectedPost.clicks || 0}</p>
                 </div>
              </div>
              <button 
                className="btn-primary-minimal" 
                style={{ width: 'auto', background: 'var(--bg-sidebar)', color: 'white', padding: '12px 32px' }}
                onClick={() => setIsPreviewOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
