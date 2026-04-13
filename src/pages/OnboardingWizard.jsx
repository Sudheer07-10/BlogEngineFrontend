import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vibes: ['genz'],
    verticals: ['cp']
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingConfig = async () => {
      const user = JSON.parse(localStorage.getItem('blog_user'));
      if (!user) return;

      try {
        const res = await fetch(`${API_URL}/api/user/config?user_id=${user.id}`);
        if (res.ok) {
          const config = await res.json();
          setFormData(prev => ({
            ...prev,
            vibes: config.vibes || ['genz'],
            verticals: config.verticals || ['cp']
          }));
        }
      } catch (err) {
        console.error('Failed to fetch persona config:', err);
      }
    };

    fetchExistingConfig();
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('blog_user'));
    
    try {
      const payload = {
        user_id: user.id,
        email: user.email,
        platform: user.platform || 'cp',
        config: {
          vibes: formData.vibes,
          verticals: formData.verticals
        }
      };
      
      console.log('DEBUG: Sending Persona Payload:', payload);
      
      const res = await fetch(`${API_URL}/api/user/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('DEBUG: Backend Response:', data);

      if (res.ok) {
        const updatedUser = { ...user, config: formData };
        localStorage.setItem('blog_user', JSON.stringify(updatedUser));
        navigate('/dashboard');
      } else {
        // Now showing the specific error from the backend instead of a generic one
        alert(`Failed to save persona: ${data.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving persona:', err);
      alert('Connection error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const vibes = [
    { id: 'genz', name: 'Gen-Z', icon: '✨', description: 'Energetic and trend-focused.' },
    { id: 'professional', name: 'Professional', icon: '💼', description: 'Clean and authoritative.' },
    { id: 'minimalist', name: 'Minimalist', icon: '☁️', description: 'Concise and airy.' },
    { id: 'aggressive', name: 'Growth Hack', icon: '🔥', description: 'Bold and click-optimized.' }
  ];

  const verticalOptions = [
    { id: 'cp', label: '🎓 Course Platform' },
    { id: 'jobs', label: '💼 Job Board' },
    { id: 'sakhi', label: '👩 Janmasethu' },
    { id: 'oa', label: '🏫 Ottobon Academy' },
    { id: 'tech', label: '💻 Technology' },
    { id: 'finance', label: '📈 Finance' }
  ];

  const toggleVibe = (vibeId) => {
    const newVibes = formData.vibes.includes(vibeId)
      ? formData.vibes.filter(v => v !== vibeId)
      : [...formData.vibes, vibeId];
    setFormData({ ...formData, vibes: newVibes });
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✨</span>
              <h2 className="heading-lg" style={{ fontSize: '1.8rem' }}>Tonal Vibe</h2>
              <p style={{ color: 'var(--text-muted)' }}>Select styles. AI will blend these for your posts.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {vibes.map(v => (
                <div 
                  key={v.id} 
                  onClick={() => toggleVibe(v.id)}
                  style={{ 
                    padding: '20px',
                    textAlign: 'center',
                    background: formData.vibes.includes(v.id) ? 'var(--bg-highlight)' : 'transparent',
                    border: formData.vibes.includes(v.id) ? '1px solid var(--accent-orange)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-small)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>{v.icon}</span>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>{v.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{v.description}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button 
                className="btn-primary-minimal" 
                style={{ width: '100%' }} 
                onClick={nextStep} 
                disabled={formData.vibes.length === 0}
              >
                Set Target Verticals →
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fadeIn">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🎯</span>
              <h2 className="heading-lg" style={{ fontSize: '1.8rem' }}>Target Verticals</h2>
              <p style={{ color: 'var(--text-muted)' }}>Which niches will your engine track?</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
              {verticalOptions.map(option => (
                <button 
                  key={option.id}
                  onClick={() => {
                    const newVerts = formData.verticals.includes(option.id) 
                      ? formData.verticals.filter(x => x !== option.id)
                      : [...formData.verticals, option.id];
                    setFormData({...formData, verticals: newVerts});
                  }}
                  style={{ 
                    padding: '14px 24px', 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    cursor: 'pointer', 
                    borderRadius: '100px',
                    border: formData.verticals.includes(option.id) ? '2px solid var(--accent-orange)' : '1px solid var(--border-light)',
                    background: formData.verticals.includes(option.id) ? 'var(--bg-highlight)' : 'white',
                    color: formData.verticals.includes(option.id) ? 'var(--accent-orange)' : 'var(--text-main)',
                    transition: 'all 0.2s ease'
                   }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-primary-minimal" 
                style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-light)', flex: 1 }} 
                onClick={prevStep}
              >
                ← Back
              </button>
              <button 
                className="btn-primary-minimal" 
                style={{ flex: 1 }} 
                onClick={handleFinish} 
                disabled={isLoading || formData.verticals.length === 0}
              >
                {isLoading ? 'Booting Engine...' : 'Finish Setup ✨'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-workspace)', padding: '20px' }}>
      <div className="card-minimal" style={{ width: '100%', maxWidth: '520px', padding: '48px', boxShadow: '0 32px 64px rgba(0,0,0,0.08)' }}>
        {/* Step Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
           {[1, 2].map(s => (
             <div key={s} style={{ 
               flex: 1, 
               height: '4px', 
               background: step >= s ? 'var(--accent-orange)' : 'var(--border-light)',
               borderRadius: '100px',
               transition: 'all 0.4s ease'
             }}></div>
           ))}
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingWizard;
