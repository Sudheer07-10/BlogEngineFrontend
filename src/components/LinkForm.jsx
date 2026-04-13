import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LinkForm({ onLinkAdded, onDiscovery, selectedPlatform, onPlatformChange }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedVertical, setSelectedVertical] = useState('General');

    const verticals = [
        { id: 'General', icon: '🌐' },
        { id: 'Education', icon: '🎓' },
        { id: 'Health care', icon: '🏥' },
        { id: 'AI', icon: '🤖' },
        { id: 'Jobs', icon: '💼' }
    ];

    const platforms = [
        { id: 'cp_blogs', label: '🎓 Course Platform' },
        { id: 'sakhi_blogs', label: '⚖️ Janmasethu' },
        { id: 'oa_blogs', label: '🏫 Ottobon Academy' },
        { id: 'jobs_blogs', label: '💼 Jobs' }
    ];

    const handleAction = async (e, mode = 'discover') => {
        if (e) e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) return;
        setLoading(true);
        setError('');
        try {
            const payload = { 
                query: trimmed, 
                url: trimmed,
                vertical: selectedVertical === 'General' ? '' : selectedVertical,
                platform: selectedPlatform.split('_')[0]
            };

            if (mode === 'discover') {
                const res = await fetch(`${API_URL}/api/discover`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Discovery failed');
                const data = await res.json();
                onDiscovery?.(data.options);
                setUrl('');
            } else {
                const res = await fetch(`${API_URL}/api/links?platform=${selectedPlatform.split('_')[0]}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error('Publish failed');
                setUrl('');
                onLinkAdded?.();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '8px' }}>
            {/* Top Controls: Platform & Verticals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="premium-label" style={{ marginBottom: 0 }}>Targeting</span>
                    <select 
                        className="premium-select"
                        value={selectedPlatform}
                        onChange={(e) => onPlatformChange(e.target.value)}
                    >
                        {platforms.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div className="vertical-chips">
                    {verticals.map((v) => (
                        <button
                            key={v.id}
                            type="button"
                            className={`vertical-chip ${selectedVertical === v.id ? 'active' : ''}`}
                            onClick={() => setSelectedVertical(v.id)}
                        >
                            <span>{v.icon}</span>
                            {v.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Wrapper */}
            <form onSubmit={(e) => handleAction(e, 'discover')}>
                <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            className="premium-input-minimal"
                            style={{ paddingRight: '120px' }}
                            placeholder={selectedVertical === 'General' 
                                ? "Paste article URL or search any topic..."
                                : `Search trending ${selectedVertical} topics...`
                            }
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                        />
                        {loading && (
                            <div style={{ position: 'absolute', right: '140px', top: '50%', transform: 'translateY(-50%)' }}>
                                <div className="loading-spinner-small"></div>
                            </div>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="submit"
                            className="btn-primary-minimal"
                            style={{ minWidth: '130px' }}
                            disabled={loading || !url.trim()}
                        >
                            {loading ? 'Discovering...' : '🔍 Discover'}
                        </button>
                        <button
                            type="button"
                            className="btn-primary-minimal"
                            style={{ background: 'var(--bg-highlight)', color: 'var(--accent-orange)', minWidth: '110px' }}
                            onClick={(e) => handleAction(e, 'direct')}
                            disabled={loading || !url.trim()}
                        >
                            🚀 Direct
                        </button>
                    </div>
                </div>
            </form>

            {error && (
                <div style={{ marginTop: '20px', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', fontWeight: '700', background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '12px' }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}
