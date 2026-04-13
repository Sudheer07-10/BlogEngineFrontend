import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LinkForm from '../components/LinkForm';
import DiscoveryResults from '../components/DiscoveryResults';

const Pipeline = () => {
  const [discoveryOptions, setDiscoveryOptions] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('cp_blogs');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('blog_user'));
    setUser(storedUser);
    if (storedUser?.platform) {
      setSelectedPlatform(storedUser.platform);
    }
  }, []);

  const handleDiscovery = (options) => {
    setDiscoveryOptions(options);
  };

  const handlePlatformChange = (newPlatform) => {
    setSelectedPlatform(newPlatform);
    const updatedUser = { ...user, platform: newPlatform };
    localStorage.setItem('blog_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handlePublished = () => {
    setDiscoveryOptions([]);
  };

  const handleDiscardAll = () => {
    setDiscoveryOptions([]);
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <header className="mb-10">
          <h2 className="heading-lg">Discovery Pipeline</h2>
          <p className="text-muted text-sm">
            Uncovering trending content for the <strong>{user?.platform?.replace('_blogs', '').toUpperCase()}</strong> network.
          </p>
        </header>

        {/* Search & Setup Card */}
        <div className="card-minimal mb-12">
          <LinkForm 
            onDiscovery={handleDiscovery}
            selectedPlatform={selectedPlatform}
            onPlatformChange={handlePlatformChange}
            onLinkAdded={() => alert('Trend Published Directly! 🚀')}
          />
        </div>

        {/* Discovery Feed Section */}
        {discoveryOptions.length > 0 ? (
          <div className="animate-fadeIn">
            <DiscoveryResults 
              options={discoveryOptions}
              onPublished={handlePublished}
              onDiscardAll={handleDiscardAll}
              selectedPlatform={selectedPlatform}
            />
          </div>
        ) : (
          /* Empty Discovery State Redesign */
          <div className="empty-state-minimal">
            <div className="empty-state-icon">
              🔍
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0' }}>
              Enter a search topic or paste an article URL above to initiate a real-time discovery session for the <strong>{user?.platform?.replace('_blogs', '').toUpperCase()}</strong> network.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Pipeline;
