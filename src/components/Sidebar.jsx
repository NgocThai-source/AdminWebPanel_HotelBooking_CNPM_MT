import React from 'react';
import {
  FileText,
  Users,
  UserRound,
  LogOut,
  Sun,
  Moon,
  Globe,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  lang,
  setLang,
  theme,
  setTheme,
  t,
  isCollapsed,
  setIsCollapsed,
}) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand-text">
            <h2>Admin Panel</h2>
            <span>Hotel Booking</span>
          </div>
        )}

        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
          title={isCollapsed ? t('navPost') : ''}
        >
          <FileText size={20} />
          {!isCollapsed && <span className="label">{t('navPost')}</span>}
        </button>

        <button
          className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          title={isCollapsed ? t('navUser') : ''}
        >
          <Users size={20} />
          {!isCollapsed && <span className="label">{t('navUser')}</span>}
        </button>

        <button
          className={`sidebar-link ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
          title={isCollapsed ? t('navCustomer') : ''}
        >
          <UserRound size={20} />
          {!isCollapsed && <span className="label">{t('navCustomer')}</span>}
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-actions">
          <button
            className="action-btn"
            onClick={() =>
              setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')
            }
            title={theme === 'theme-dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
          >
            {theme === 'theme-dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="action-btn"
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            title="Đổi ngôn ngữ"
          >
            <Globe size={18} />
            {!isCollapsed && (
              <span className="lang-text">{lang === 'vi' ? 'EN' : 'VI'}</span>
            )}
          </button>
        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
          title={isCollapsed ? t('logout') : ''}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
}