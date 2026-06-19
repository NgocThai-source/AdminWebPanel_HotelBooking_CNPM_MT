import React, { useEffect, useState } from 'react';
import {
  Mail,
  Building2,
  Clock3,
  MoreVertical,
  Trash2,
  Search,
  LockKeyhole,
  UnlockKeyhole,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import './UserManagement.css';

export default function UserManagement({ t }) {
  const [filter, setFilter] = useState('pending');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('host_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      console.log(error);
      toast.error('Không thể tải dữ liệu người dùng!');
      return;
    }

    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendApprovalEmail = async (user) => {
    const response = await fetch(
      'https://akdpqpazdxzxaneixolr.supabase.co/functions/v1/send-approval-email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          hotelName: user.hotel_name,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result?.error || 'Send email failed');
    }

    return result;
  };

  const handleApprove = async (id) => {
    const selectedUser = users.find((user) => user.id === id);

    if (!selectedUser) {
      toast.error('Không tìm thấy tài khoản!');
      return;
    }

    setProcessingId(id);

    const { error } = await supabase
      .from('host_accounts')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error('Duyệt tài khoản thất bại!');
      setProcessingId(null);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'approved' } : user
      )
    );

    try {
      await sendApprovalEmail(selectedUser);
      toast.success('Đã duyệt tài khoản và gửi email thông báo!');
    } catch (mailError) {
      console.log('MAIL ERROR:', mailError);
      toast.error('Đã duyệt tài khoản nhưng gửi email thất bại!');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);

    const { error } = await supabase
      .from('host_accounts')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error('Từ chối tài khoản thất bại!');
      setProcessingId(null);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'rejected' } : user
      )
    );

    toast.success('Đã từ chối tài khoản!');
    setProcessingId(null);
  };

  const handleLock = async (id) => {
    setProcessingId(id);

    const { error } = await supabase
      .from('host_accounts')
      .update({ status: 'locked' })
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error('Khóa tài khoản thất bại!');
      setProcessingId(null);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'locked' } : user
      )
    );

    setOpenMenuId(null);
    setProcessingId(null);
    toast.success('Đã khóa tài khoản!');
  };

  const handleUnlock = async (id) => {
    setProcessingId(id);

    const { error } = await supabase
      .from('host_accounts')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error('Mở khóa tài khoản thất bại!');
      setProcessingId(null);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: 'approved' } : user
      )
    );

    setOpenMenuId(null);
    setProcessingId(null);
    toast.success('Đã mở khóa tài khoản!');
  };

  const handleDelete = async (id) => {
    const selectedUser = users.find((user) => user.id === id);

    if (!selectedUser) {
      toast.error('Không tìm thấy tài khoản!');
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tài khoản "${selectedUser.username}" không?`
    );

    if (!confirmDelete) return;

    setProcessingId(id);

    const { error } = await supabase
      .from('host_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error('Xóa tài khoản thất bại!');
      setProcessingId(null);
      return;
    }

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setOpenMenuId(null);
    setProcessingId(null);
    toast.success('Đã xóa tài khoản thành công!');
  };

  const displayedUsers = users.filter((user) => {
    const status = user.status || 'pending';
    const matchStatus = status === filter;
    const matchEmail = (user.email || '')
      .toLowerCase()
      .includes(searchEmail.trim().toLowerCase());

    return matchStatus && matchEmail;
  });

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const formatDateTime = (value) => {
    if (!value) return 'Chưa có thời gian';
    return new Date(value).toLocaleString('vi-VN');
  };

  const getStatusClass = (status) => {
    if (status === 'pending') return 'warning';
    if (status === 'approved') return 'success';
    if (status === 'locked') return 'locked';
    return 'danger';
  };

  return (
    <div className="user-management-container">
      <div className="user-top-row">
        <div className="header-titles">
          <h1>{t('userTitle')}</h1>
          <p>{t('userDesc')}</p>
        </div>

        <div className="user-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-pills">
        <button
          className={`pill ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          {t('pending')}
        </button>

        <button
          className={`pill ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          {t('approved')}
        </button>

        <button
          className={`pill ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          {t('rejected')}
        </button>

        <button
          className={`pill ${filter === 'locked' ? 'active' : ''}`}
          onClick={() => setFilter('locked')}
        >
          {t('locked') || 'Đã khóa'}
        </button>
      </div>

      <div className="user-grid">
        {loading ? (
          <p
            style={{
              color: 'var(--text-desc)',
              gridColumn: '1 / -1',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            Đang tải dữ liệu...
          </p>
        ) : displayedUsers.length === 0 ? (
          <p
            style={{
              color: 'var(--text-desc)',
              gridColumn: '1 / -1',
              textAlign: 'center',
              marginTop: '40px',
            }}
          >
            Không có dữ liệu trong mục này.
          </p>
        ) : (
          displayedUsers.map((user, index) => {
            const status = user.status || 'pending';

            return (
              <div
                className="user-card"
                key={user.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-card-menu">
                  <button
                    type="button"
                    className="user-menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === user.id ? null : user.id)
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === user.id && (
                    <div className="user-menu-dropdown">
                      {status === 'locked' ? (
                        <button
                          type="button"
                          className="menu-unlock-btn"
                          onClick={() => handleUnlock(user.id)}
                          disabled={processingId === user.id}
                        >
                          <UnlockKeyhole size={15} />
                          {t('unlockBtn') || 'Mở khóa'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="menu-lock-btn"
                          onClick={() => handleLock(user.id)}
                          disabled={processingId === user.id}
                        >
                          <LockKeyhole size={15} />
                          {t('lockBtn') || 'Khóa'}
                        </button>
                      )}

                      <button
                        type="button"
                        className="menu-delete-btn"
                        onClick={() => handleDelete(user.id)}
                        disabled={processingId === user.id}
                      >
                        <Trash2 size={15} />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                <div className="user-avatar">
                  {getInitials(user.username || user.hotel_name)}
                </div>

                <div className="user-name">{user.username}</div>

                <div className="user-role-badge">{t('roleOwner')}</div>

                <div className="user-info-list">
                  <div className="user-info-item">
                    <Building2 size={14} color="var(--cyan-main)" />
                    {user.hotel_name}
                  </div>

                  <div className="user-info-item">
                    <Mail size={14} color="var(--cyan-main)" />
                    {user.email}
                  </div>

                  <div className="user-info-item">
                    <Clock3 size={14} color="var(--cyan-main)" />
                    {formatDateTime(user.created_at)}
                  </div>
                </div>

                {status === 'locked' ? (
  <div className="locked-chain">
    <div className="chain-line" />
    <div className="lock-icon">🔒</div>
  </div>
) : (
  <span className={`status-badge-inline ${getStatusClass(status)}`}>
    {t(status) || status}
  </span>
)}

                {status === 'pending' && (
                  <div className="user-action-row">
                    <button
                      className="btn-user btn-approve"
                      onClick={() => handleApprove(user.id)}
                      disabled={processingId === user.id}
                    >
                      {processingId === user.id
                        ? 'Đang xử lý...'
                        : `✓ ${t('approveBtn')}`}
                    </button>

                    <button
                      className="btn-user btn-reject"
                      onClick={() => handleReject(user.id)}
                      disabled={processingId === user.id}
                    >
                      {processingId === user.id
                        ? 'Đang xử lý...'
                        : `✕ ${t('rejectBtn')}`}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}