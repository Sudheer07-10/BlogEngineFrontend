import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import OnboardingWizard from './pages/OnboardingWizard';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import EditorPage from './pages/EditorPage';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import SharePage from './pages/SharePage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

export default function App() {
  // --- SINGLE USER MODE: Auto-initialize Session ---
  useEffect(() => {
    const existingUser = localStorage.getItem('blog_user');
    if (!existingUser) {
      const defaultUser = {
        id: 'default_editor',
        email: 'editor@ottobon.academy',
        platform: 'oa_blogs',
        config: null // Will be populated by Onboarding
      };
      localStorage.setItem('blog_user', JSON.stringify(defaultUser));
      console.log('DEBUG: Single User Session Initialized.');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Setup */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        
        {/* Application Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Public Shareable Content */}
        <Route path="/card/:id" element={<SharePage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
