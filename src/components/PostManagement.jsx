import React, { useEffect, useState } from 'react';
import {
  MapPin,
  MoreVertical,
  Trash2,
  Search,
  CalendarDays,
  X,
  BedDouble,
  Users,
  DollarSign,
  Hotel,
  ClipboardList,
  Star,
  Tag,
  ImageOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import './PostManagement.css';
import './UserManagement.css';

export default function PostManagement({ t }) {
  const [filter, setFilter] = useState('pending');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      console.log(error);
      toast.error(t('loadPostFail') || 'Không thể tải dữ liệu bài đăng!');
      return;
    }

    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openHotelDetail = async (hotelId) => {
  setDetailOpen(true);
  setDetailLoading(true);
  setSelectedHotel(null);
  setHotelRooms([]);

  try {
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('id', hotelId)
      .single();

    if (hotelError) throw hotelError;

    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotel.id)
      .order('id', { ascending: true });

    if (roomsError) throw roomsError;

    console.log('HOTEL:', hotel);
    console.log('ROOMS:', rooms);

    setSelectedHotel(hotel);
    setHotelRooms(rooms || []);
  } catch (error) {
    console.log('DETAIL ERROR:', error);
    toast.error('Không thể tải chi tiết khách sạn!');
    setDetailOpen(false);
  } finally {
    setDetailLoading(false);
  }
};

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedHotel(null);
    setHotelRooms([]);
  };

  const updatePostStatus = async (id, status) => {
    setProcessingId(id);

    const { error } = await supabase
      .from('hotels')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.log(error);
      toast.error(
        status === 'approved'
          ? t('approvePostFail') || 'Duyệt bài đăng thất bại!'
          : t('rejectPostFail') || 'Từ chối bài đăng thất bại!'
      );
      setProcessingId(null);
      return;
    }

    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status } : post))
    );

    setSelectedHotel((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );

    toast.success(
      status === 'approved'
        ? t('approvePostSuccess') || 'Đã duyệt bài đăng!'
        : t('rejectPostSuccess') || 'Đã từ chối bài đăng!'
    );

    setProcessingId(null);
  };

  const handleApprove = (id) => updatePostStatus(id, 'approved');

  const handleReject = (id) => updatePostStatus(id, 'rejected');

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      t('confirmDeletePost') || 'Bạn có chắc muốn xóa bài đăng này?'
    );

    if (!confirmDelete) return;

    setProcessingId(id);

    await supabase.from('rooms').delete().eq('hotel_id', id);

    const { error } = await supabase.from('hotels').delete().eq('id', id);

    if (error) {
      console.log(error);
      toast.error(t('deletePostFail') || 'Xóa bài đăng thất bại!');
      setProcessingId(null);
      return;
    }

    setPosts((prev) => prev.filter((post) => post.id !== id));
    setOpenMenuId(null);
    setProcessingId(null);

    if (selectedHotel?.id === id) closeDetail();

    toast.success(t('deletePostSuccess') || 'Đã xóa bài đăng!');
  };

  const displayedPosts = posts.filter((post) => {
    const status = post.status || 'pending';
    const keyword = searchText.trim().toLowerCase();

    const matchStatus = status === filter;

    const matchSearch =
      (post.title || '').toLowerCase().includes(keyword) ||
      (post.location || '').toLowerCase().includes(keyword) ||
      (post.hostName || '').toLowerCase().includes(keyword);

    return matchStatus && matchSearch;
  });

  const formatDate = (value) => {
  if (!value || value === 'NULL') {
    return t('notAvailable') || 'Chưa có';
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('vi-VN');
};

  const formatMoney = (value) => {
    const number = Number(value || 0);
    return `$${number}`;
  };

  const safeText = (value, fallback = t('notAvailable') || 'Chưa có') => {
  if (value === null || value === undefined || value === '' || value === 'NULL') {
    return fallback;
  }
  return value;
};

const getImage = (url, fallback) => {
  if (!url || url === 'NULL' || url === null) {
    return fallback;
  }

  return String(url).trim();
};

  const formatAmenity = (item = '') => {
    const text = String(item).trim();

    const map = {
      pool: 'Pool',
      gym: 'Gym',
      restaurant: 'Restaurant',
      parking: 'Parking',
      wifi: 'Wifi',
      spa: 'Spa',
      breakfast: 'Breakfast',
    };

    return map[text.toLowerCase()] || text;
  };

  const getAmenities = (post) => {
    if (Array.isArray(post?.amenities)) return post.amenities;

    if (typeof post?.amenities === 'string') {
      try {
        const parsed = JSON.parse(post.amenities);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return post.amenities
          .replace('[', '')
          .replace(']', '')
          .replaceAll('"', '')
          .replaceAll("'", '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const renderStatusBadge = (status) => (
    <span
      className={`status-badge ${
        status === 'pending'
          ? 'warning'
          : status === 'approved'
          ? 'success'
          : 'danger'
      }`}
    >
      {t(status)}
    </span>
  );

  return (
    <div className="post-management-container">
      <div className="user-top-row">
        <div className="header-titles">
          <h1>{t('postTitle')}</h1>
          <p>{t('postDesc')}</p>
        </div>

        <div className="user-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t('searchPost') || 'Tìm kiếm bài đăng...'}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
      </div>

      <div className="property-grid">
        {loading ? (
          <p className="post-empty-text">
            {t('loadingData') || 'Đang tải dữ liệu...'}
          </p>
        ) : displayedPosts.length === 0 ? (
          <p className="post-empty-text">
            {t('noData') || 'Không có dữ liệu trong mục này.'}
          </p>
        ) : (
          displayedPosts.map((post, index) => {
            const status = post.status || 'pending';
            const amenities = getAmenities(post);

            return (
              <div
                className="property-card"
                key={post.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openHotelDetail(post.id)}
              >
                <div className="user-card-menu post-menu">
                  <button
                    type="button"
                    className="user-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === post.id ? null : post.id);
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === post.id && (
                    <div
                      className="user-menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="menu-delete-btn"
                        onClick={() => handleDelete(post.id)}
                        disabled={processingId === post.id}
                      >
                        <Trash2 size={15} />
                        {t('deleteAccount') || 'Xóa'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="property-image">
                  <img
                    src={
                      post.image_url ||
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={post.title || 'Hotel'}
                  />

                  {renderStatusBadge(status)}
                </div>

                <div className="property-details">
                  <div className="property-header">
                    <h4>{post.title || t('noHotelName') || 'Chưa có tên'}</h4>
                    <span className="post-price">{formatMoney(post.price)}</span>
                  </div>

                  <div className="info-list">
                    <div className="info-item">
                      <MapPin size={15} />
                      <span>{post.location || t('noAddress') || 'Chưa có địa chỉ'}</span>
                    </div>

                    <div className="info-item">
                      <CalendarDays size={15} />
                      <span>
  Check-in: {post.check_in_date ? formatDate(post.check_in_date) : t('notAvailable')}
</span>
</div>

<div className="info-item">
  <CalendarDays size={15} />
  <span>
    Check-out: {post.check_out_date ? formatDate(post.check_out_date) : t('notAvailable')}
  </span>
</div>
                  </div>

                  <div className="amenities-row">
                    <span className="amenity-chip">Hotel</span>

                    {amenities.length > 0 ? (
                      amenities.map((item, i) => (
                        <span className="amenity-chip" key={i}>
                          {formatAmenity(item)}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="amenity-chip">Pool</span>
                        <span className="amenity-chip">Gym</span>
                        <span className="amenity-chip">Restaurant</span>
                        <span className="amenity-chip">Parking</span>
                      </>
                    )}
                  </div>

                  {status === 'pending' && (
                    <div className="action-row post-action-row">
                      <button
                        className="btn-action btn-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(post.id);
                        }}
                        disabled={processingId === post.id}
                      >
                        ✓ {t('approveBtn')}
                      </button>

                      <button
                        className="btn-action btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(post.id);
                        }}
                        disabled={processingId === post.id}
                      >
                        ✕ {t('rejectBtn')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {detailOpen && (
  <div className="hotel-detail-backdrop" onClick={closeDetail}>
    <div className="hotel-detail-modal-v2" onClick={(e) => e.stopPropagation()}>
      <div className="hotel-detail-topbar">
        <div>
          <span className="hotel-detail-label">
            {t('hotelDetailTitle') || 'Chi tiết khách sạn'}
          </span>
          <h2>{selectedHotel?.title || t('noHotelName') || 'Chưa có tên'}</h2>
        </div>

        <button className="hotel-detail-close" onClick={closeDetail}>
          <X size={20} />
        </button>
      </div>

      {detailLoading ? (
        <div className="hotel-detail-loading">
          {t('loadingData') || 'Đang tải dữ liệu...'}
        </div>
      ) : selectedHotel ? (
        <>
          <div className="hotel-detail-content-v2">
            <div className="hotel-gallery-v2">
              <div className="hotel-gallery-main">
                {selectedHotel.image_url ? (
                  <img
                    src={getImage(
                      selectedHotel.image_url,
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
                    )}
                    alt={selectedHotel.title || 'Hotel'}
                  />
                ) : (
                  <div className="hotel-image-empty">
                    <ImageOff size={42} />
                    <span>{t('noImage') || 'Chưa có hình ảnh'}</span>
                  </div>
                )}

                <div className="hotel-gallery-status">
                  {renderStatusBadge(selectedHotel.status || 'pending')}
                </div>
              </div>

              <div className="hotel-gallery-side">
                {hotelRooms.slice(0, 3).map((room) => (
                  <img
                    key={room.id}
                    src={getImage(
                      room.image_url,
                      selectedHotel.image_url ||
                        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'
                    )}
                    alt={room.room_name || 'Room'}
                  />
                ))}
              </div>
            </div>

            <div className="hotel-summary-v2">
              <div>
                <h3>{selectedHotel.title || t('noHotelName') || 'Chưa có tên'}</h3>
                <p>
                  <MapPin size={16} />
                  {safeText(selectedHotel.location, t('noAddress') || 'Chưa có địa chỉ')}
                </p>
              </div>

              <div className="hotel-price-v2">
                {formatMoney(selectedHotel.price)}
                <span>{t('night')}</span>
              </div>
            </div>

            <div className="hotel-info-grid-v2">
              <div className="hotel-info-box">
                <Tag size={18} />
                <span>{t('category') || 'Loại hình'}</span>
                <b>{safeText(selectedHotel.category, 'Hotel')}</b>
              </div>

              <div className="hotel-info-box">
                <Hotel size={18} />
                <span>{t('hostName') || 'Tên chủ khách sạn'}</span>
                <b>{safeText(selectedHotel.hostName)}</b>
              </div>

              <div className="info-item">
  <CalendarDays size={15} />
  <span>Check-in: {formatDate(post.check_in_date)}</span>
</div>

<div className="info-item">
  <CalendarDays size={15} />
  <span>Check-out: {formatDate(post.check_out_date)}</span>
</div>

              <div className="hotel-info-box">
                <Star size={18} />
                <span>{t('reviewCount') || 'Số đánh giá'}</span>
                <b>{selectedHotel.review_count || 0}</b>
              </div>

              <div className="hotel-info-box">
                <ClipboardList size={18} />
                <span>{t('status') || 'Trạng thái'}</span>
                <b>{t(selectedHotel.status || 'pending')}</b>
              </div>
            </div>

            <div className="hotel-section-v2">
              <h4>{t('description') || 'Mô tả khách sạn'}</h4>
              <p>
                {selectedHotel.description ||
                  t('noDescription') ||
                  'Chưa có mô tả.'}
              </p>
            </div>

            <div className="hotel-section-v2">
              <h4>{t('amenities') || 'Tiện ích'}</h4>

              <div className="hotel-amenities-v2">
                {getAmenities(selectedHotel).length > 0 ? (
                  getAmenities(selectedHotel).map((item, index) => (
                    <span key={index} className="amenity-chip">
                      {formatAmenity(item)}
                    </span>
                  ))
                ) : (
                  <span className="amenity-chip">
                    {t('noAmenities') || 'Chưa có tiện ích'}
                  </span>
                )}
              </div>
            </div>

            <div className="hotel-section-v2">
              <div className="room-section-title-v2">
                <div>
                  <h4>{t('roomList') || 'Danh sách phòng'}</h4>
                  <p>
                    {hotelRooms.length} {t('rooms') || 'phòng'}
                  </p>
                </div>
              </div>

              {hotelRooms.length === 0 ? (
                <p className="hotel-detail-empty">
                  {t('noRooms') || 'Khách sạn này chưa có phòng.'}
                </p>
              ) : (
                <div className="room-list-v2">
                  {hotelRooms.map((room) => (
                    <div className="room-card-v2" key={room.id}>
                      <div className="room-image-v2">
                        <img
  src={getImage(
    room.image_url || room.image || room.room_image_url,
    selectedHotel.image_url ||
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80'
  )}
  alt={room.room_name || 'Room'}
  onError={(e) => {
    e.currentTarget.src =
      selectedHotel.image_url ||
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80';
  }}
/>
                      </div>

                      <div className="room-content-v2">
                        <div className="room-head-v2">
                          <div>
                            <h5>
                              {room.room_name ||
                                t('noRoomName') ||
                                'Chưa có tên phòng'}
                            </h5>
                            <span>
                              {room.room_type ||
                                t('notAvailable') ||
                                'Chưa có loại phòng'}
                            </span>
                          </div>

                          <b>{formatMoney(room.price_per_night)}</b>
                        </div>

                        <div className="room-meta-v2">
                          <p>
                            <Users size={15} />
                            {t('capacity') || 'Sức chứa'}: {room.capacity || 0}
                          </p>

                          <p>
                            <BedDouble size={15} />
                            {t('roomCount') || 'Số lượng'}:{' '}
                            {room.room_count || 0}
                          </p>

                          <p>
                            <DollarSign size={15} />
                            {t('roomPrice') || 'Giá phòng'}:{' '}
                            {formatMoney(room.price_per_night)}
                          </p>
                        </div>

                        <p className="room-desc-v2">
                          {room.description ||
                            t('noDescription') ||
                            'Chưa có mô tả.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hotel-detail-footer-v2">
            <button className="btn-secondary" onClick={closeDetail}>
              {t('closeBtn') || 'Đóng'}
            </button>

            {(selectedHotel.status || 'pending') === 'pending' && (
              <>
                <button
                  className="btn-action btn-success"
                  onClick={() => handleApprove(selectedHotel.id)}
                  disabled={processingId === selectedHotel.id}
                >
                  ✓ {t('approveBtn')}
                </button>

                <button
                  className="btn-action btn-danger"
                  onClick={() => handleReject(selectedHotel.id)}
                  disabled={processingId === selectedHotel.id}
                >
                  ✕ {t('rejectBtn')}
                </button>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  </div>
)}
    </div>
  );
}