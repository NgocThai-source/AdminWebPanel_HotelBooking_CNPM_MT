import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import './UserManagement.css';

export default function UserManagement({ t }) {
  const [filter, setFilter] = useState('pending');

  const [users, setUsers] = useState([
    { id: 1, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0987.654.321', roleKey: 'roleCus', status: 'pending' },
    { id: 2, name: 'Lê Văn C', email: 'levanc@hotel.com', phone: '0912.345.678', roleKey: 'roleOwner', status: 'pending' },
    { id: 3, name: 'Công Ty D', email: 'contact@partner.vn', phone: '0900.111.222', roleKey: 'rolePartner', status: 'pending' }
  ]);

  const handleApprove = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: 'approved' } : user));
  };

  const handleReject = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: 'rejected' } : user));
  };

  const displayedUsers = users.filter(user => user.status === filter);
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="user-management-container">
      <div className="header-titles">
        <h1>{t('userTitle')}</h1>
        <p>{t('userDesc')}</p>
      </div>

      <div className="filter-pills">
        <button className={`pill ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>{t('pending')}</button>
        <button className={`pill ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>{t('approved')}</button>
        <button className={`pill ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>{t('rejected')}</button>
      </div>

      <div className="user-grid">
        {displayedUsers.length === 0 ? (
          <p style={{ color: 'var(--text-desc)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>Không có dữ liệu trong mục này.</p>
        ) : (
          displayedUsers.map((user, index) => (
            <div className="user-card" key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-name">{user.name}</div>
              <div className="user-role-badge">{t(user.roleKey)}</div>
              
              <div className="user-info-list">
                <div className="user-info-item"><Mail size={14} color="var(--cyan-main)" /> {user.email}</div>
                <div className="user-info-item"><Phone size={14} color="var(--cyan-main)" /> {user.phone}</div>
              </div>

              <span className={`status-badge-inline ${user.status === 'pending' ? 'warning' : user.status === 'approved' ? 'success' : 'danger'}`}>
                {t(user.status)}
              </span>

              {user.status === 'pending' && (
                <div className="user-action-row">
                  <button className="btn-user btn-approve" onClick={() => handleApprove(user.id)}>✓ {t('approveBtn')}</button>
                  <button className="btn-user btn-reject" onClick={() => handleReject(user.id)}>✕ {t('rejectBtn')}</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}