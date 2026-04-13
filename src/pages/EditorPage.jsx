import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PostEditor from '../components/PostEditor';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [option, setOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the candidate by ID
    // For now, we'll check if it was passed via state or just show a placeholder
    const mockOption = {
      title: 'The Future of AI in SaaS',
      summary: 'Explore how generative AI is reshaping the software-as-a-service landscape with automated workflows and predictive insights.',
      url: 'https://example.com/ai-saas',
      domain: 'techtrends.com',
      hashtags: ['#ai', '#saas', '#future'],
      full_data: {
        body_text: 'Generative AI is not just a buzzword; it is a fundamental shift in how we build and consume software. From automated customer support to predictive code generation...'
      }
    };
    
    setOption(mockOption);
    setLoading(false);
  }, [id]);

  const handlePublish = async (updatedData) => {
    console.log('Publishing from Full Page Editor:', updatedData);
    alert('Post Published Successfully! 🎉');
    navigate('/dashboard');
  };

  const handleDiscard = () => {
    navigate('/pipeline');
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ←
          </button>
          <div>
            <h1 className="header__title" style={{ fontSize: '1.8rem' }}>Refine Content</h1>
            <p className="header__subtitle">Optimize your post for the best engagement.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>Loading editor...</div>
        ) : (
          <div className="glass-card" style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
            <PostEditor 
              option={option}
              onPublish={handlePublish}
              onDiscard={handleDiscard}
              isPublishing={false}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditorPage;
