import {
  X,
  MapPin,
  Building2,
  Calendar,
  Edit3,
  Hotel,
  Star
} from 'lucide-react';

import './HotelFormModal.css';

export default function HotelDetailModal({
  hotel,
  onClose,
  onEdit
}) {
  if (!hotel) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-container detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BODY SCROLL */}
        <div className="detail-modal-body">

          {/* HOTEL IMAGE */}
          {hotel.image_url ? (
            <img
              src={hotel.image_url}
              alt={hotel.title}
              className="detail-modal-img"
            />
          ) : (
            <div className="detail-modal-img-placeholder">
              <Hotel size={48} />
            </div>
          )}

          {/* HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '20px'
            }}
          >
            <div>
              <h2>{hotel.title}</h2>

              <div className="detail-location">
                <MapPin size={14} />
                <span>{hotel.location}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* STATS */}
          <div className="detail-stats">
            <div className="detail-stat">
              <span
                className="detail-stat-value"
                style={{ color: 'var(--cyan-main)' }}
              >
                ${hotel.price || 0}
              </span>

              <span className="detail-stat-label">
                Per Night ($)
              </span>
            </div>

            {hotel.rating > 0 && (
              <div className="detail-stat">
                <span
                  className="detail-stat-value"
                  style={{ color: '#f59e0b' }}
                >
                  {Number(hotel.rating).toFixed(1)}
                </span>

                <span className="detail-stat-label">
                  <Star
                    size={10}
                    fill="#f59e0b"
                    color="#f59e0b"
                    style={{ marginRight: 2 }}
                  />
                  Rating
                  {hotel.review_count > 0 &&
                    ` (${hotel.review_count} reviews)`}
                </span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {hotel.description && (
            <p className="detail-description">
              {hotel.description}
            </p>
          )}

          {/* ROOMS */}
          {hotel.rooms?.length > 0 && (
            <div
              style={{
                marginTop: '24px',
                marginBottom: '24px'
              }}
            >
              <h3
                style={{
                  color: '#fff',
                  fontSize: '20px',
                  marginBottom: '16px'
                }}
              >
                Rooms ({hotel.rooms.length})
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: '#111827',
                      border:
                        '1px solid rgba(255,255,255,.08)'
                    }}
                  >
                    {room.image_url && (
                      <img
                        src={room.image_url}
                        alt={
                          room.room_name ||
                          `Room ${room.id}`
                        }
                        style={{
                          width: '100%',
                          height: '220px',
                          objectFit: 'cover'
                        }}
                      />
                    )}

                    <div
                      style={{
                        padding: '16px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          marginBottom: '10px'
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: '#fff'
                          }}
                        >
                          {room.room_name ||
                            room.room_type ||
                            `Room #${room.id}`}
                        </h4>

                        <span
                          style={{
                            color: '#06B6D4',
                            fontWeight: 700,
                            fontSize: '18px'
                          }}
                        >
                          $
                          {room.price_per_night ||
                            0}
                        </span>
                      </div>

                      {room.description && (
                        <p
                          style={{
                            color: '#94A3B8',
                            fontSize: '13px',
                            marginBottom: '12px'
                          }}
                        >
                          {room.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '20px',
                          color: '#94A3B8',
                          fontSize: '13px'
                        }}
                      >
                        <span>
                          👥 {room.capacity} Guests
                        </span>

                        <span>
                          🛏 {room.room_count} Rooms
                        </span>
                      </div>

                      {/* CHECK IN / OUT */}
                      <div
                        style={{
                          marginTop: '14px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        {hotel.check_in_date && (
                          <span className="detail-tag">
                            <Calendar size={12} />
                            Check-in:
                            {hotel.check_in_date}
                          </span>
                        )}

                        {hotel.check_out_date && (
                          <span className="detail-tag">
                            <Calendar size={12} />
                            Check-out:
                            {hotel.check_out_date}
                          </span>
                        )}
                      </div>

                      {/* ROOM AMENITIES */}
                      {hotel.amenities?.length > 0 && (
                        <div
                          style={{
                            marginTop: '14px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}
                        >
                          {hotel.amenities.map(
                            (amenity, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding:
                                    '5px 12px',
                                  borderRadius:
                                    '999px',
                                  background:
                                    'rgba(6,182,212,.15)',
                                  color:
                                    '#06B6D4',
                                  fontSize:
                                    '12px'
                                }}
                              >
                                {amenity}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* META */}
          <div className="detail-meta">
            <span className="detail-tag">
              <Building2 size={12} />
              {hotel.category || 'Hotel'}
            </span>

            {hotel.host_name && (
              <span className="detail-tag">
                Host: {hotel.host_name}
              </span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="detail-modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>

          <button
            onClick={onEdit}
            className="btn-primary"
          >
            <Edit3 size={16} />
            <span>Edit Property</span>
          </button>
        </div>
      </div>
    </div>
  );
}