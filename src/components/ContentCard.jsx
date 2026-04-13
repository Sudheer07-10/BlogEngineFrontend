import { useState, useEffect } from 'react';

const HASHTAG_CLASSES = [
    'hashtag--0',
    'hashtag--1',
    'hashtag--2',
    'hashtag--3',
    'hashtag--4',
];

function formatTimeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ContentCard({ card, index = 0, onDelete, platform = 'cp' }) {
    const animDelay = `${index * 0.08}s`;
    const [copied, setCopied] = useState(false);

    // Track a view when the card is displayed
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/links/${card.id}/track?field=views&platform=${platform}`, {
                    method: 'POST'
                });
            } catch (err) {
                console.error("Failed to track view:", err);
            }
        };
        trackView();
    }, [card.id, platform]);

    const handleTrackClick = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/links/${card.id}/track?field=clicks&platform=${platform}`, {
                method: 'POST'
            });
        } catch (err) {
            console.error("Failed to track click:", err);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(card.id);
    };

    const handleShare = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const shareUrl = `${window.location.origin}/card/${card.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSocialShare = (platform) => {
        const shareUrl = `${window.location.origin}/card/${card.id}`;
        
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



    return (
        <article
            className="content-card"
            style={{ animationDelay: animDelay, cursor: 'pointer' }}
            id={`card-${card.id}`}
            onClick={() => window.location.href = `/card/${card.id}`}
        >
            {/* Thumbnail Image */}
            {card.image_url ? (
                <img
                    className="content-card__image"
                    src={card.image_url}
                    alt={card.title}
                    loading="lazy"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                    }}
                />
            ) : null}
            {!card.image_url && (
                <div className="content-card__image-placeholder">
                    📰
                </div>
            )}

            <div className="content-card__body">
                {/* Domain Badge */}
                <div className="content-card__domain">
                    <span className="content-card__domain-dot" />
                    {card.domain}
                </div>

                {/* Title */}
                <h3 className="content-card__title">{card.title}</h3>

                {/* Summary */}
                <p className="content-card__summary">{card.summary}</p>

                {/* Hashtags */}
                {card.hashtags?.length > 0 && (
                    <div className="content-card__hashtags">
                        {card.hashtags.slice(0, 6).map((tag, i) => (
                            <span
                                key={tag}
                                className={`hashtag ${HASHTAG_CLASSES[i] || 'hashtag--default'}`}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Read More + Share + Time + Delete */}
                <div className="content-card__footer">
                    <a
                        className="content-card__read-more"
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`read-more-${card.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTrackClick();
                        }}
                    >
                        Read full article
                        <span className="content-card__read-more-arrow">→</span>
                    </a>

                    <div className="share-row" onClick={(e) => e.stopPropagation()}>
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

                        <span className="content-card__time">
                            {formatTimeAgo(card.created_at)}
                        </span>
                        <button
                            className="content-card__delete"
                            onClick={handleDelete}
                            title="Remove card"
                            aria-label="Delete card"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
