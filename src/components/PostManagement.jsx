import React, { useState } from 'react';
import './PostManagement.css'; 

export default function PostManagement({ t }) {
  // 1. Quản lý Tab đang chọn (Mặc định là 'pending' - Chờ duyệt)
  const [filter, setFilter] = useState('pending');

  // 2. Chuyển dummyPosts thành State và thêm thuộc tính status: 'pending'
  const [posts, setPosts] = useState([
    { id: 1, name: 'Sapa Legend Hotel & Spa', type: 'Resort', author: 'Nguyễn Văn A', phone: '0981.234.567', location: 'Sapa, Lào Cai', rooms: 45, price: 85, status: 'pending', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Mường Thanh Luxury', type: 'Hotel', author: 'Trần Thị B', phone: '0912.345.678', location: 'Sơn Trà, Đà Nẵng', rooms: 120, price: 120, status: 'pending', img: 'https://images.unsplash.com/photo-1551882547-ff40c0d509af?auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Eco Homestay Da Lat', type: 'Homestay', author: 'Lê Văn C', phone: '0905.111.222', location: 'Phường 3, Đà Lạt', rooms: 8, price: 45, status: 'pending', img: 'https://images.unsplash.com/photo-1499916078039-922301b0eb9b?auto=format&fit=crop&w=500&q=60' }
  ]);

  // 3. Hàm xử lý Duyệt và Từ chối
  const handleApprove = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'approved' } : post));
  };

  const handleReject = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, status: 'rejected' } : post));
  };

  // 4. Lọc dữ liệu theo Tab hiện tại
  const displayedPosts = posts.filter(post => post.status === filter);

  return (
    <div className="post-management-container">
      <div className="header-titles">
        <h1>{t('postTitle')}</h1>
        <p>{t('postDesc')}</p>
      </div>

      {/* THANH ĐIỀU HƯỚNG TÌNH TRẠNG (TABS) */}
      <div className="filter-pills">
        <button className={`pill ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>{t('pending')}</button>
        <button className={`pill ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>{t('approved')}</button>
        <button className={`pill ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>{t('rejected')}</button>
      </div>

      <div className="property-grid">
        {displayedPosts.length === 0 ? (
          <p style={{ color: 'var(--text-desc)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>Không có dữ liệu trong mục này.</p>
        ) : (
          displayedPosts.map((post, index) => (
            <div className="property-card" key={post.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="property-image">
                <img src={post.img} alt={post.name} loading="lazy" />
                <span className={`status-badge ${post.status === 'pending' ? 'warning' : post.status === 'approved' ? 'success' : 'danger'}`}>
                  {t(post.status)}
                </span>
              </div>
              <div className="property-details">
                <div className="property-header">
                  <h4>{post.name}</h4><span className="rating">{post.type}</span>
                </div>
                <div className="info-list">
                  <div className="info-item"><span className="info-icon">📍</span> {post.location}</div>
                  <div className="info-item"><span className="info-icon">👤</span> {post.author}</div>
                  <div className="info-item"><span className="info-icon">🛏️</span> {post.rooms} {t('rooms')}</div>
                </div>
                <div className="price-row">
                  <span className="price">${post.price}</span><span className="unit">{t('night')}</span>
                </div>
                
                {/* Chỉ hiện 2 nút nếu thẻ đang ở trạng thái Chờ duyệt */}
                {post.status === 'pending' && (
                  <div className="action-row">
                    <button className="btn-action btn-success" onClick={() => handleApprove(post.id)}>✓ {t('approveBtn')}</button>
                    <button className="btn-action btn-danger" onClick={() => handleReject(post.id)}>✕ {t('rejectBtn')}</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}