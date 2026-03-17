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
        { id: 'cp', label: '🎓 Course Platform', table: 'cp_blogs' },
        { id: 'sakhi', label: '⚖️ Janmasethu', table: 'sakhi_blogs' },
        { id: 'jobs', label: '💼 Jobs', table: 'jobs_blogs' }
    ];

    const handleAction = async (e, mode = 'direct') => {
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
                platform: selectedPlatform
            };

            if (mode === 'discover') {
                const res = await fetch(`${API_URL}/api/discover`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.detail || `Discovery failed (${res.status})`);
                }

                const data = await res.json();
                onDiscovery?.(data.options);
                setUrl('');
            } else {
                const res = await fetch(`${API_URL}/api/links?platform=${selectedPlatform}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.detail || `Publish failed (${res.status})`);
                }

                setUrl('');
                onLinkAdded?.();
            }
        } catch (err) {
            setError(err.message || 'Failed to process. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="link-form">
            <div className="platform-selector">
                <label className="platform-selector__label">Target Platform:</label>
                <select 
                    className="platform-selector__select"
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
                        className={`vertical-chip ${selectedVertical === v.id ? 'vertical-chip--active' : ''}`}
                        onClick={() => setSelectedVertical(v.id)}
                    >
                        <span className="vertical-chip__icon">{v.icon}</span>
                        {v.id}
                    </button>
                ))}
            </div>

            <form onSubmit={(e) => handleAction(e, 'discover')}>
                <div className="link-form__wrapper">
                    <input
                        id="url-input"
                        type="text"
                        className="link-form__input"
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
                        autoComplete="off"
                    />
                    <div style={{ display: 'flex', gap: '8px', paddingRight: '6px' }}>
                        <button
                            id="submit-btn"
                            type="submit"
                            className={`link-form__btn ${loading ? 'link-form__btn--loading' : ''}`}
                            disabled={loading || !url.trim()}
                        >
                            {loading ? '...' : '🔍 Discover'}
                        </button>
                        <button
                            type="button"
                            className="link-form__btn"
                            style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}
                            onClick={(e) => handleAction(e, 'direct')}
                            disabled={loading || !url.trim()}
                        >
                            🚀 Direct
                        </button>
                    </div>
                </div>
            </form>

            {error && (
                <div className="link-form__error" id="error-message">
                    ⚠️ {error}
                </div>
            )}

            {loading && (
                <div className="processing-toast">
                    <div className="processing-toast__spinner" />
                    <span className="processing-toast__text">
                        Scraping & analyzing top coverage...
                    </span>
                </div>
            )}
        </div>
    );
}
