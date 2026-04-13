import { useState, useEffect } from 'react';
import PostEditor from './PostEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DiscoveryResults({ options, onPublished, onDiscardAll, selectedPlatform }) {
    const [publishingId, setPublishingId] = useState(null);
    const [localOptions, setLocalOptions] = useState(options || []);

    useEffect(() => {
        setLocalOptions(options || []);
    }, [options]);

    const handlePublish = async (option, index) => {
        setPublishingId(index);
        try {
            const res = await fetch(`${API_URL}/api/publish?platform=${selectedPlatform.split('_')[0]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(option),
            });

            if (!res.ok) throw new Error('Failed to publish');

            onPublished?.();
            // Remove from local list after publish
            setLocalOptions(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
            alert('Error publishing: ' + err.message);
        } finally {
            setPublishingId(null);
        }
    };

    const handleDiscard = (index) => {
        setLocalOptions(prev => prev.filter((_, i) => i !== index));
    };

    if (!localOptions || localOptions.length === 0) return null;

    return (
        <div className="discovery-results">
            <div className="discovery-results__header" style={{ marginBottom: '24px' }}>
                <h3 className="section-header__title">
                    ✨ Discovery Results
                </h3>
                <button 
                    className="link-form__btn"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', maxWidth: 'max-content' }}
                    onClick={onDiscardAll}
                >
                    Discard All
                </button>
            </div>

            <div className="post-editor-grid">
                {localOptions.map((opt, idx) => (
                    <PostEditor 
                        key={idx} 
                        option={opt} 
                        isPublishing={publishingId === idx}
                        onPublish={(updatedOption) => handlePublish(updatedOption, idx)}
                        onDiscard={() => handleDiscard(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
