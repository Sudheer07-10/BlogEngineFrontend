import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Schedule = () => {
  const navigate = useNavigate();
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchSchedules = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('blog_user') || '{}');
      setUser(storedUser);
      const platform = storedUser?.platform?.split('_')[0] || 'cp';
      
      // Fetch Scheduled Posts (Upcoming/In Progress)
      const resSched = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/schedule?platform=${platform}`);
      const schedData = await resSched.json();
      setUpcomingPosts(schedData);

      // Fetch Published Posts (Completed)
      const resPubs = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/links?platform=${platform}`);
      if (resPubs.ok) {
        const pubsData = await resPubs.json();
        setCompletedPosts(pubsData.map(p => ({ ...p, status: 'PUBLISHED', type: 'Completed' })));
      }
    } catch (err) {
      console.error("Failed to fetch schedule", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this scheduled post?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/schedule/${id}`, {
        method: 'DELETE'
      });
      setUpcomingPosts(upcomingPosts.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete schedule", err);
    }
  };

  const handlePublishNow = async (id) => {
    if (!confirm('Are you sure you want to publish this post right now?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/schedule/${id}/publish`, {
        method: 'POST'
      });
      if (res.ok) {
        setUpcomingPosts(upcomingPosts.filter(p => p.id !== id));
        alert('Successfully published!');
      }
    } catch (err) {
      console.error("Failed to publish schedule", err);
    }
  };

  const formatScheduleDate = (isoString) => {
    if (!isoString) return 'Not set';
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h2 className="heading-lg">Schedule</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage and monitor your upcoming trend blasts.</p>
          </div>
          <button 
            onClick={() => navigate('/pipeline')} 
            className="btn-primary-minimal"
          >
            + New Schedule
          </button>
        </header>

        {/* --- DUAL COLUMN GRID: Utilizing the space --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* Main Column: Schedule List */}
          <div className="card-minimal" style={{ border: '1px solid var(--accent-orange)', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <button 
                onClick={() => setActiveTab('upcoming')}
                style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'upcoming' ? '2px solid var(--accent-orange)' : 'none', color: activeTab === 'upcoming' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'upcoming' ? '700' : '600', paddingBottom: '8px', cursor: 'pointer' }}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setActiveTab('in-progress')}
                style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'in-progress' ? '2px solid var(--accent-orange)' : 'none', color: activeTab === 'in-progress' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'in-progress' ? '700' : '600', paddingBottom: '8px', cursor: 'pointer' }}
              >
                In Progress
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                style={{ background: 'transparent', border: 'none', borderBottom: activeTab === 'completed' ? '2px solid var(--accent-orange)' : 'none', color: activeTab === 'completed' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: activeTab === 'completed' ? '700' : '600', paddingBottom: '8px', cursor: 'pointer' }}
              >
                Completed
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Syncing with calendar...</p>
              ) : (
                (() => {
                  let filtered = [];
                  if (activeTab === 'upcoming') filtered = upcomingPosts.filter(p => !p.status || p.status === 'READY');
                  if (activeTab === 'in-progress') filtered = upcomingPosts.filter(p => p.status === 'DRAFTING' || p.status === 'PENDING');
                  if (activeTab === 'completed') filtered = completedPosts;

                  if (filtered.length === 0) return (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                      <p>The {activeTab} queue is empty. Ready for new trends?</p>
                    </div>
                  );

                  return filtered.map((post) => (
                    <div key={post.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '20px 24px', 
                      borderRadius: 'var(--radius-small)', 
                      background: post.status === 'READY' ? 'var(--bg-highlight)' : 'white', 
                      border: post.status === 'READY' ? '1px solid var(--accent-orange)' : '1px solid var(--border-light)',
                      boxShadow: post.status === 'READY' ? '0 4px 12px rgba(255, 107, 63, 0.1)' : 'none'
                    }}>
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          background: 'var(--bg-sidebar)', 
                          borderRadius: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {activeTab === 'completed' ? '✅' : '🎨'}
                        </div>
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{post.title || "Untitled Trend"}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {activeTab === 'completed' ? `🚀 Published ${formatScheduleDate(post.created_at)}` : `📅 ${formatScheduleDate(post.scheduled_for)}`}
                            </p>
                            {post.url && (
                              <a href={post.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: '700' }}>
                                🔗 Source
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '800', 
                          background: post.status === 'READY' ? 'var(--accent-orange)' : 'rgba(0,0,0,0.05)', 
                          color: post.status === 'READY' ? 'white' : 'var(--text-muted)', 
                          padding: '6px 12px', 
                          borderRadius: '100px' 
                        }}>
                          {post.status?.toUpperCase() || 'QUEUED'}
                        </span>
                        
                        {activeTab !== 'completed' && (
                          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                            <button 
                              onClick={() => handlePublishNow(post.id)}
                              title="Publish Now"
                              style={{ background: 'var(--bg-sidebar)', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                              🚀
                            </button>
                            <button 
                              onClick={() => handleDelete(post.id)}
                              title="Remove"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>

          {/* Strategy Column: Space Utilization Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
             {/* Strategy Card */}
             <div className="card-minimal" style={{ textAlign: 'center', background: 'var(--bg-sidebar)', color: 'white' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✨</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Active Vibe Profile</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Optimizing content for your selected styles.</p>
                
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

                <div style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', background: 'rgba(255,107,63,0.1)', border: '1px dashed var(--accent-orange)' }}>
                   <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-orange)', marginBottom: '4px' }}>💡 SCHEDULING TIP</p>
                   <p style={{ fontSize: '0.75rem', color: 'white', opacity: 0.8, lineHeight: 1.4 }}>
                      Batch scheduling trends during peak engagement hours increases reach by up to 2.5x.
                   </p>
                </div>
             </div>

             {/* Action Card */}
             <div className="card-minimal" style={{ background: '#F8FAFC', borderStyle: 'dashed' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px' }}>Need more content?</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Jump back to the pipeline to discover new trending topics.</p>
                <button 
                  onClick={() => navigate('/pipeline')}
                  style={{ width: '100%', background: 'var(--text-main)', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                >
                   🚀 Discovery Pipeline
                </button>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;
