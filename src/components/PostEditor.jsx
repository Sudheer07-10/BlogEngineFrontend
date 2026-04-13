import { useState } from 'react';

export default function PostEditor({ option, onPublish, onDiscard, isPublishing }) {
  // SEO optimization fields initialized from option or empty
  const [title, setTitle] = useState(option.title || '');
  const [summary, setSummary] = useState(option.summary || '');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [metaTitle, setMetaTitle] = useState(option.metaTitle || option.title || '');
  const [slug, setSlug] = useState(option.slug || '');
  
  const handleAIRefine = async () => {
    setIsSummarizing(true);
    try {
      // We use the original title + summary or the full body if available as context
      const textToSummarize = option.full_data?.body_text || option.summary || option.title;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/summarize-persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToSummarize
        }),
      });
      
      const data = await res.json();
      
      // Update all SEO fields with the AI's suggestions
      if (data.summary) setSummary(data.summary);
      if (data.title) setTitle(data.title);
      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.slug) setSlug(data.slug);
      if (data.keywords) setKeywords(data.keywords);
      if (data.summary) setMetaDescription(data.summary);
      
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const [metaDescription, setMetaDescription] = useState(option.metaDescription || option.summary || '');
  const [keywords, setKeywords] = useState(option.keywords || '');

  const [hashtags, setHashtags] = useState(option.hashtags || [
    '# mentalhealth', 
    '# maincharacterenergy', 
    '# protectyourpeace', 
    '# goodvibesonly', 
    '# happiness'
  ]);
  const [newHashtag, setNewHashtag] = useState('');

  const removeHashtag = (indexToRemove) => {
    setHashtags(hashtags.filter((_, idx) => idx !== indexToRemove));
  };

  const addHashtag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = newHashtag.trim();
      if (tag && !hashtags.includes(tag)) {
        // Ensure it starts with #
        const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
        setHashtags([...hashtags, formattedTag]);
        setNewHashtag('');
      } else if (hashtags.includes(tag)) {
        setNewHashtag('');
      }
    }
  };

  const handlePublish = () => {
    onPublish({
      url: option.url, // CRITICAL: Fix 422 error by including the required URL
      title,
      summary,
      seo: { metaTitle, slug, metaDescription, keywords },
      hashtags
    });
  };

  const handleSchedule = async () => {
    if (!scheduledFor) {
      alert("Please select a date and time for the schedule.");
      return;
    }
    
    setIsScheduling(true);
    try {
      const user = JSON.parse(localStorage.getItem('blog_user') || '{}');
      const platform = user?.platform?.split('_')[0] || 'cp';

      const payload = {
        title,
        summary,
        meta_title: metaTitle,
        slug: slug,
        meta_description: metaDescription,
        keywords,
        hashtags,
        source_url: option.url,
        full_data: option.full_data,
        scheduled_for: new Date(scheduledFor).toISOString(),
        status: 'READY'
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Post scheduled successfully!");
        onDiscard(); // Close editor and remove from queue since it's scheduled
      } else {
        alert("Failed to schedule post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling post.");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="card-minimal" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: Title & Persona Magic */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <label className="premium-label">Suggested Title</label>
          <button 
            className="btn-primary-minimal" 
            onClick={handleAIRefine}
            disabled={isSummarizing}
            style={{ padding: '6px 14px', fontSize: '0.75rem', background: 'var(--bg-highlight)', color: 'var(--accent-orange)' }}
          >
            {isSummarizing ? '⌛ Refining...' : '✨ AI Refine'}
          </button>
        </div>
        <textarea 
          className="premium-input-minimal" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.4', border: 'none', paddingLeft: 0, paddingRight: 0, borderRadius: 0, borderBottom: '1px solid var(--border-light)' }}
        />
      </div>

      {/* Summary Section */}
      <div style={{ marginBottom: '24px' }}>
        <label className="premium-label">Executive Summary</label>
        <textarea 
          className="premium-input-minimal" 
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          style={{ fontSize: '0.95rem', lineHeight: '1.6', background: 'var(--bg-workspace)', border: 'none' }}
        />
      </div>

      {/* Tags & Source */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginBottom: '32px' }}>
         <div style={{ minWidth: 0 }}>
            <label className="premium-label">Source Context</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-workspace)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ opacity: 0.7 }}>🔗</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>{option.url}</span>
            </div>
         </div>
         <div style={{ minWidth: 0 }}>
            <label className="premium-label">Target Hashtags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {hashtags.slice(0, 4).map((tag, idx) => (
                <span key={idx} style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: '800', 
                    padding: '6px 12px', 
                    background: 'var(--bg-highlight)', 
                    color: 'var(--accent-orange)', 
                    borderRadius: '100px',
                    whiteSpace: 'nowrap'
                }}>
                  {tag}
                </span>
              ))}
              {hashtags.length > 4 && (
                <span style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.5, padding: '4px' }}>
                  +{hashtags.length - 4} more
                </span>
              )}
            </div>
         </div>
      </div>

      {/* SEO Section (Collapsible Header) */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '1.1rem' }}>📈</span>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO Optimization</h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
           <div>
              <label className="premium-label" style={{ fontSize: '0.65rem' }}>Slug</label>
              <input type="text" className="premium-input-minimal" value={slug} onChange={e => setSlug(e.target.value)} style={{ padding: '10px' }} />
           </div>
           <div>
              <label className="premium-label" style={{ fontSize: '0.65rem' }}>Keywords</label>
              <input type="text" className="premium-input-minimal" value={keywords} onChange={e => setKeywords(e.target.value)} style={{ padding: '10px' }} />
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ 
          marginTop: '32px', 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '16px', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px'
      }}>
        <button 
          className="btn-primary-minimal" 
          onClick={onDiscard}
          disabled={isPublishing || isScheduling}
          style={{ background: 'var(--bg-workspace)', color: '#ef4444', padding: '12px 20px', border: '1px solid var(--border-light)' }}
        >
          Discard
        </button>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-workspace)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>🕒</span>
              <input 
                type="datetime-local" 
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none', color: 'var(--text-main)', width: '130px' }}
              />
              <button 
                onClick={handleSchedule}
                disabled={isScheduling || !scheduledFor}
                style={{ background: 'var(--text-main)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}
              >
                {isScheduling ? '...' : 'Queue'}
              </button>
           </div>

           <button 
            className="btn-primary-minimal" 
            onClick={handlePublish}
            disabled={isPublishing || isScheduling}
            style={{ padding: '12px 24px' }}
          >
            {isPublishing ? 'Publishing...' : 'Publish Now ➔'}
          </button>
        </div>
      </div>
    </div>
  );
}
