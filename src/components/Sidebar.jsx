import React from 'react';
import { FileText, Users, LogOut, Sun, Moon, Globe } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout, lang, setLang, theme, setTheme, t }) {
  return (
    <aside className="sidebar" style={{ backgroundColor: 'var(--bg-sidebar)', width: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh', borderRight: '1px solid var(--border-line)', transition: 'all 0.3s' }}>
      <div className="sidebar-header" style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Admin Panel</h2>
        <span style={{ color: 'var(--cyan-main)', fontSize: '13px' }}>Design Intelligence</span>
      </div>

      <nav className="sidebar-nav" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: activeTab === 'posts' ? 'var(--cyan-main)' : 'transparent', color: activeTab === 'posts' ? 'white' : '#94A3B8', fontWeight: 'bold' }}
        >
          <FileText size={20} /> {t('navPost')}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: activeTab === 'users' ? 'var(--cyan-main)' : 'transparent', color: activeTab === 'users' ? 'white' : '#94A3B8', fontWeight: 'bold' }}
        >
          <Users size={20} /> {t('navUser')}
        </button>
      </nav>

      <div className="sidebar-footer" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setTheme(theme === 'theme-dark' ? 'theme-light' : 'theme-dark')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
            {theme === 'theme-dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '6px', fontWeight: 'bold' }}>
            <Globe size={18} /> {lang === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', justifyContent: 'center', gap: '8px', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={18} /> {t('logout')}
        </button>
      </div>
    </aside>
  );
}