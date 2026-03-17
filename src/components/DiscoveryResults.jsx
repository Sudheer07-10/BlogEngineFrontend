import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DiscoveryResults({ options, onPublished, onDiscardAll, selectedPlatform }) {
    const [publishingId, setPublishingId] = useState(null);

    const handlePublish = async (option, index) => {
        setPublishingId(index);
        try {
            const res = await fetch(`${API_URL}/api/publish?platform=${selectedPlatform}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(option),
            });

            if (!res.ok) throw new Error('Failed to publish');

            onPublished?.();
        } catch (err) {
            alert('Error publishing: ' + err.message);
        } finally {
            setPublishingId(null);
        }
    };

    if (!options || options.length === 0) return null;

    return (
        <div className="discovery-results">
            <div className="discovery-results__header">
                <h3 className="discovery-results__title">
                    ✨ Discovery Results
                </h3>
                <button 
                    className="candidate-card__btn candidate-card__btn--discard"
                    style={{ width: 'auto', padding: '8px 16px' }}
                    onClick={onDiscardAll}
                >
                    Discard All
                </button>
            </div>

            <div className="discovery-results__grid">
                {options.map((opt, idx) => (
                    <div key={idx} className="candidate-card">
                        <div className="candidate-card__source">
                            {opt.source}
                        </div>
                        <h4 className="candidate-card__title">{opt.title}</h4>
                        <p className="candidate-card__summary">{opt.summary}</p>
                        
                        <div className="candidate-card__actions">
                            <a 
                                href={opt.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="candidate-card__btn candidate-card__btn--discard"
                                style={{ textDecoration: 'none' }}
                            >
                                🔗 View Original
                            </a>
                            <button
                                className="candidate-card__btn candidate-card__btn--publish"
                                onClick={() => handlePublish(opt, idx)}
                                disabled={publishingId !== null}
                            >
                                {publishingId === idx ? 'Publishing...' : '✅ Publish'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
