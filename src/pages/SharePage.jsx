import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const HASHTAG_CLASSES = [
    'hashtag--0',
    'hashtag--1',
    'hashtag--2',
    'hashtag--3',
    'hashtag--4',
];

export default function SharePage() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchCard() {
            try {
                const res = await fetch(`${API_URL}/api/links/${id}`);
                if (!res.ok) throw new Error('Content not found');
                const data = await res.json();
                setCard(data);

                // Update page title dynamically
                document.title = `${data.title} — Vertical Pulse`;
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCard();
    }, [id]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSocialShare = (platform) => {
        const shareUrl = window.location.href;
        
        // Use only the title for X (Twitter)
        let xContent = card.title || "";
        if (xContent.length > 240) {
            xContent = xContent.substring(0, 237) + "...";
        }

        const encodedXText = encodeURIComponent(xContent);
        const encodedUrl = encodeURIComponent(shareUrl);

        let finalUrl = '';
        if (platform === 'x') {
            finalUrl = `https://twitter.com/intent/tweet?text=${encodedXText}&url=${encodedUrl}`;
        } else if (platform === 'linkedin') {
            finalUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        } else if (platform === 'facebook') {
            finalUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        }

        if (finalUrl) {
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
        }
    };



    if (loading) {
        return (
            <div className="share-page">
                <div className="share-page__loading">
                    <div className="processing-toast__spinner" style={{ width: 32, height: 32 }} />
                    <p>Loading content...</p>
                </div>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="share-page">
                <div className="share-page__error">
                    <div className="share-page__error-icon">🔗</div>
                    <h2>Content Not Found</h2>
                    <p>This content may have been removed or the link is invalid.</p>
                    <Link to="/" className="share-page__back-btn">← Back to Hub</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="share-page">
            {/* Top Navigation Bar */}
            <nav className="share-page__top-nav">
                <Link to="/" className="share-page__back">← Back</Link>
                <div className="share-row">
                    <span className="share-row__label">Share:</span>
                    <div className="share-row__icons">
                        <button className="share-row__icon" onClick={() => handleSocialShare('x')} title="Share on X">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        </button>
                        <button className="share-row__icon" onClick={() => handleSocialShare('facebook')} title="Share on Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.597 1.325-1.326V1.326C24 .597 23.403 0 22.675 0z"/></svg>
                        </button>
                        <button className="share-row__icon" onClick={() => handleSocialShare('linkedin')} title="Share on LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </button>
                        <button className={`share-row__icon ${copied ? 'share-row__icon--copied' : ''}`} onClick={handleShare} title="Copy link">
                            {copied ? '✅' : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a3.001 3.001 0 0 0 0-4.24 3.001 3.001 0 0 0-4.24 0l-3.53 3.53a3.001 3.001 0 0 0 0 4.24zm2.82-4.24c-.41-.39-.41-1.03 0-1.42.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.42l-.47.48a3.001 3.001 0 0 0 0 4.24 3.001 3.001 0 0 0 4.24 0l3.53-3.53a3.001 3.001 0 0 0 0-4.24z"/></svg>}
                        </button>
                    </div>
                </div>
            </nav>

            <article className="share-card">
                {/* Meta Row: Avatar, Domain, Date */}
                <div className="share-card__meta-row">
                    <div className="share-card__avatar">
                        {card.domain.charAt(0).toUpperCase()}
                    </div>
                    <span>{card.domain}</span>
                    <span>·</span>
                    <span>{new Date(card.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Title */}
                <h1 className="share-card__title">{card.title}</h1>

                {/* Description (Subtitle) */}
                {card.description && (
                    <h2 className="share-card__description">{card.description}</h2>
                )}

                {/* Hero image (optional, minimalist) */}
                {card.image_url && (
                    <img
                        src={card.image_url}
                        alt="Article hero visual"
                        className="share-card__hero-img"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                )}

                {/* Body Content */}
                <div className="share-card__body-text">
                    {/* Render the summary text, splitting newlines into paragraphs */}
                    {card.summary.split('\n').map((paragraph, idx) => (
                        paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
                    ))}
                </div>

                {/* Minimalist Infographic / Stats integration */}
                {(card.content_images?.length > 0 || card.callout_stats?.length > 0) && (
                    <div className="share-card__visuals">
                        {card.callout_stats?.map((stat, i) => (
                            <div key={`stat-${i}`} className="share-card__stat-block">
                                <span className="stat-quote">"</span>
                                <p>{stat}</p>
                            </div>
                        ))}

                        {card.content_images?.map((imgUrl, i) => (
                            <img
                                key={`img-${i}`}
                                src={imgUrl}
                                alt="Article visual insight"
                                className="share-card__info-img"
                                loading="lazy"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ))}
                    </div>
                )}

                {/* Hashtags */}
                {card.hashtags?.length > 0 && (
                    <div className="share-card__hashtags" style={{ marginTop: '24px' }}>
                        {card.hashtags.map((tag) => (
                            <span key={tag} className="hashtag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Read More CTA */}
                <div className="share-card__cta">
                    <p className="share-card__source">
                        Read full article at <strong>{card.domain}</strong>
                    </p>
                    <a
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-card__read-more-btn"
                    >
                        Read Original →
                    </a>
                </div>
            </article>

            {/* Footer */}
                <p>Curated by <Link to="/">Vertical Pulse</Link></p>
        </div>
    );
}
