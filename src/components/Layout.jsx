import React from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('blog_user') || '{}');

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/schedule', label: 'Schedule', icon: '📅' },
    { path: '/pipeline', label: 'Pipeline', icon: '🔍' },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* Sidebar: New Solid Black Design */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>BlogEngine</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>


      </aside>

      {/* Main Workspace */}
      <main className="main-wrapper">
        {/* Top Header Bar */}
        <header className="top-bar">


          <Link to="/profile" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            textDecoration: 'none', 
            color: 'inherit',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '16px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: location.pathname === '/profile' ? 'var(--bg-workspace)' : 'transparent'
          }} className="profile-trigger-hover">
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0 }}>OTTOBON</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{user.platform?.replace('_blogs', '').toUpperCase() || 'General'}</p>
            </div>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              background: 'var(--accent-orange)', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(255, 107, 63, 0.2)',
              position: 'relative'
            }}>
              {'O'}
              {location.pathname === '/profile' && (
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid white' }}></div>
              )}
            </div>
          </Link>
        </header>

        <style>{`
          .profile-trigger-hover:hover {
            background: var(--bg-workspace) !important;
            transform: translateY(-1px);
          }
          .profile-trigger-hover:active {
            transform: translateY(0);
          }
        `}</style>

        {/* Dynamic Page Content */}
        <section className="animate-fadeIn">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
