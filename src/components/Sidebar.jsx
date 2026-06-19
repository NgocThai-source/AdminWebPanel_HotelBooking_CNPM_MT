import { Hotel, Settings, Bell, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      id: 'hotels',
      path: '/dashboard',
      label: 'Hotel Management',
      icon: Hotel,
    },
    {
      id: 'settings',
      path: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'notifications',
      path: '/dashboard/notifications',
      label: 'Notifications',
      icon: Bell,
    },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-wrap">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <div className="sidebar-logo-glow" />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand">Admin Panel</span>
          <span className="sidebar-brand-sub">Hotel Booking</span>
        </div>
      </div>

      {/* Section Label */}
      <div className="sidebar-section-label">Navigation</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ id, path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button
              key={id}
              className={`sidebar-link ${active ? 'sidebar-link--active' : ''}`}
              onClick={() => navigate(path)}
            >
              {/* Active indicator bar */}
              <span className="sidebar-link-indicator" />

              {/* Icon */}
              <span className="sidebar-link-icon">
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </span>

              {/* Label */}
              <span className="sidebar-link-label">{label}</span>

              {/* Active arrow */}
              {active && (
                <span className="sidebar-link-arrow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          <span className="sidebar-logout-icon">
            <LogOut size={18} strokeWidth={2} />
          </span>
          <span className="sidebar-logout-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
