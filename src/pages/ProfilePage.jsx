import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('blog_user') || '{}');
    const config = user.config || { vibes: [], target: 'Not Set' };

    const handleRestartOnboarding = () => {
        if (window.confirm("Changing your content strategy will update your generation style. Ready to pivot? 🚀")) {
            navigate('/onboarding');
        }
    };

    const platforms = [
        { id: 'oa_blogs', label: '🏫 Ottobon Academy' },
        { id: 'sakhi_blogs', label: '⚖️ Janmasethu' },
        { id: 'cp_blogs', label: '🎓 Course Platform' },
        { id: 'jobs_blogs', label: '💼 Jobs' }
    ];

    const handlePlatformChange = (newPlatform) => {
        const updatedUser = { ...user, platform: newPlatform };
        localStorage.setItem('blog_user', JSON.stringify(updatedUser));
        // Force reload to sync all components and data fetching with new platform
        window.location.reload();
    };

    return (
        <Layout>
            <div className="animate-fadeIn">
                <header className="mb-10">
                    <h2 className="heading-lg">User Profile</h2>
                    <p className="text-muted text-sm">
                        Manage your account identity and content style preferences.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
                    
                    {/* Left: Account Identity */}
                    <div className="card-minimal" style={{ height: 'fit-content' }}>
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                background: 'var(--accent-orange)', 
                                color: 'white', 
                                borderRadius: '24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 16px',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 16px rgba(255, 107, 63, 0.15)'
                            }}>
                                {'O'}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>OTTOBON</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Editor Role • {user.id?.slice(0,8)}</p>
                            
                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', textAlign: 'left' }}>
                                <label className="premium-label">Platform Network</label>
                                <select 
                                    className="premium-select"
                                    style={{ width: '100%', marginBottom: '16px', height: '48px', fontWeight: '800' }}
                                    value={user.platform}
                                    onChange={(e) => handlePlatformChange(e.target.value)}
                                >
                                    {platforms.map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Your dashboard and pipeline will now filter for this network.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content Strategy Configuration */}
                    <div className="card-minimal">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>✨ Content Strategy Settings</h3>
                            <button 
                                onClick={handleRestartOnboarding}
                                className="btn-primary-minimal"
                                style={{ background: 'var(--bg-workspace)', color: 'var(--text-main)', border: '1px solid var(--border-light)', padding: '8px 16px', fontSize: '0.8rem' }}
                            >
                                Update Strategy
                            </button>
                        </div>

                        <div>
                            <label className="premium-label">Vibe Identity</label>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                These styles guide the AI when generating and refining your blog posts.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {config.vibes?.length > 0 ? (
                                    config.vibes.map((vibe, idx) => (
                                        <span key={idx} style={{ 
                                            background: 'var(--bg-highlight)', 
                                            color: 'var(--accent-orange)', 
                                            padding: '8px 16px', 
                                            borderRadius: '100px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '700' 
                                        }}>
                                            #{vibe.toUpperCase()}
                                        </span>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No specific vibes set. Using default neutral style.</p>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '48px', padding: '20px', background: 'rgba(255, 107, 63, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 107, 63, 0.1)' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', marginBottom: '8px', fontWeight: '800' }}>💡 Pro Tip</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, opacity: 0.8 }}>
                                Your selected vibes directly influence the tone of summaries and rewrites in the Pipeline. Resetting your strategy will re-align all future content.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
