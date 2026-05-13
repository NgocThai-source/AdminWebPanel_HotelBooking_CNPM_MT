import { useState, useEffect } from 'react';
import { Bell, Send, User, MessageSquare, RefreshCw, CheckCircle, ChevronDown, Search, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationsApi } from '../services/notificationsApi';
import './NotificationsPage.css';

export default function NotificationsPage({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await notificationsApi.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error('Failed to load users list');
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone?.includes(userSearch)
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserSearch('');
    setShowDropdown(false);
    setHistory([]);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setHistory([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || !title.trim() || !body.trim()) {
      toast.error('Please select a user and fill in all fields');
      return;
    }

    setSending(true);
    try {
      const notification = await notificationsApi.sendByUserId({
        userId: selectedUser.id,
        title: title.trim(),
        body: body.trim(),
      });
      toast.success('Notification sent to ' + selectedUser.email + ' successfully!');
      setHistory((prev) => [{ ...notification, sentAt: new Date().toISOString(), email: selectedUser.email }, ...prev]);
      setTitle('');
      setBody('');
    } catch (err) {
      toast.error(err.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleLoadHistory = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }
    setLoadingHistory(true);
    try {
      const data = await notificationsApi.getAll(selectedUser.id);
      setHistory(data.map((n) => ({ ...n, sentAt: n.created_at, email: selectedUser.email })));
      if (data.length === 0) {
        toast.success('No notifications found for this user');
      }
    } catch (err) {
      toast.error('Failed to load notification history');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="dashboard notif-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand">Admin Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          <a className="sidebar-link" href="/dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Hotel Management</span>
          </a>
          <a className="sidebar-link sidebar-link--active" href="/dashboard/notifications">
            <Bell size={18} />
            <span>Notifications</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Send Notifications</h1>
            <p className="dash-subtitle">Push real-time notifications to app users via email</p>
          </div>
        </header>

        <div className="notif-layout">
          {/* Send Form */}
          <div className="notif-form-card animate-fade-in">
            <div className="notif-form-header">
              <div className="notif-form-icon">
                <Send size={20} />
              </div>
              <h2>New Notification</h2>
            </div>

            <form onSubmit={handleSend} className="notif-form">
              {/* User Selection */}
              <div className="notif-field">
                <label className="notif-label">
                  <Mail size={14} />
                  Target User
                </label>
                {selectedUser ? (
                  <div className="selected-user-display">
                    <div className="selected-user-info">
                      <User size={16} className="selected-user-icon" />
                      <div>
                        <div className="selected-user-name">{selectedUser.full_name || 'No name'}</div>
                        <div className="selected-user-email">{selectedUser.email}</div>
                        {selectedUser.phone && <div className="selected-user-phone">{selectedUser.phone}</div>}
                      </div>
                    </div>
                    <button type="button" className="clear-user-btn" onClick={handleClearUser}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="user-dropdown-wrapper">
                    <div className="search-wrapper-inline">
                      <Search size={14} className="search-icon-inline" />
                      <input
                        type="text"
                        className="notif-input"
                        placeholder="Search by email, name, or phone..."
                        value={userSearch}
                        onChange={(e) => { setUserSearch(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                      />
                    </div>
                    {showDropdown && (
                      <div className="user-dropdown">
                        {loadingUsers ? (
                          <div className="dropdown-loading">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                          <div className="dropdown-empty">No users found</div>
                        ) : (
                          filteredUsers.slice(0, 20).map((u) => (
                            <div
                              key={u.id}
                              className="dropdown-user-item"
                              onClick={() => handleSelectUser(u)}
                            >
                              <div className="dropdown-user-avatar">
                                {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="dropdown-user-details">
                                <div className="dropdown-user-name">{u.full_name || 'No name'}</div>
                                <div className="dropdown-user-email">{u.email}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="notif-field">
                <label className="notif-label">
                  <MessageSquare size={14} />
                  Title
                </label>
                <input
                  type="text"
                  className="notif-input"
                  placeholder="Notification title (max 100 chars)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="notif-field">
                <label className="notif-label">Message Body</label>
                <textarea
                  className="notif-textarea"
                  placeholder="Enter notification message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="btn-primary notif-submit"
                disabled={sending || !selectedUser}
              >
                {sending ? (
                  <>
                    <span className="spinner" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History Panel */}
          <div className="notif-history-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="notif-history-header">
              <h2>
                {selectedUser
                  ? `Notifications for ${selectedUser.email}`
                  : 'User Notifications'}
              </h2>
              <button
                className="btn-icon"
                onClick={handleLoadHistory}
                disabled={loadingHistory || !selectedUser}
                title="Load notifications"
              >
                <RefreshCw size={16} className={loadingHistory ? 'spin-animation' : ''} />
              </button>
            </div>

            {!selectedUser ? (
              <div className="notif-empty-hint">
                <Mail size={32} strokeWidth={1} />
                <p>Select a user from the left panel to view their notification history</p>
              </div>
            ) : history.length === 0 && !loadingHistory ? (
              <div className="notif-empty-hint">
                <CheckCircle size={32} strokeWidth={1} />
                <p>No notifications sent to this user yet</p>
              </div>
            ) : (
              <div className="notif-history-list">
                {history.map((item) => (
                  <div key={item.id} className="notif-history-item">
                    <div className={`notif-history-badge notif-badge--${item.type?.toLowerCase() || 'admin'}`}>
                      {item.type === 'BOOKING_CONFIRMED' ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Bell size={14} />
                      )}
                    </div>
                    <div className="notif-history-content">
                      <div className="notif-history-title">{item.title}</div>
                      <div className="notif-history-body">{item.body}</div>
                      <div className="notif-history-time">
                        {new Date(item.sentAt || item.created_at).toLocaleString()}
                      </div>
                    </div>
                    {item.is_read ? (
                      <span className="notif-read-badge">Read</span>
                    ) : (
                      <span className="notif-unread-badge">Unread</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
