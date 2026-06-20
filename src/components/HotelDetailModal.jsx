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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-modal-body">

          {/* IMAGE */}
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '20px'
          }}>
            <div>
              <h2>{hotel.title}</h2>

              <div className="detail-location">
                <MapPin size={14} />
                <span>{hotel.location}</span>
              </div>
            </div>

            <button onClick={onClose} className="modal-close">
              <X size={20} />
            </button>
          </div>

          {/* STATS */}
          <div className="detail-stats">
            <div className="detail-stat">
              <span style={{ color: 'var(--cyan-main)' }}>
                ${hotel.price || 0}
              </span>
              <span>Per Night</span>
            </div>

            {hotel.rating > 0 && (
              <div className="detail-stat">
                <span style={{ color: '#f59e0b' }}>
                  {Number(hotel.rating).toFixed(1)}
                </span>
                <span>
                  <Star size={10} fill="#f59e0b" /> Rating
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
            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
              <h3 style={{ color: '#fff' }}>
                Rooms ({hotel.rooms.length})
              </h3>

              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#111827',
                    marginTop: '18px',
                    border: '1px solid rgba(255,255,255,.08)'
                  }}
                >

                  {/* ROOM IMAGE */}
                  {room.image_url && (
                    <img
                      src={room.image_url}
                      alt={room.room_name}
                      style={{
                        width: '100%',
                        height: '220px',
                        objectFit: 'cover'
                      }}
                    />
                  )}

                  <div style={{ padding: '16px' }}>

                    {/* NAME + PRICE */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <h4 style={{ color: '#fff', margin: 0 }}>
                        {room.room_name || room.room_type || `Room #${room.id}`}
                      </h4>

                      <span style={{ color: '#06B6D4', fontWeight: 700 }}>
                        ${room.price_per_night || 0}
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    {room.description && (
                      <p style={{ color: '#94A3B8', fontSize: '13px' }}>
                        {room.description}
                      </p>
                    )}

                    {/* INFO */}
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '13px',
                      color: '#94A3B8'
                    }}>
                      <span>👥 {room.capacity} Guests</span>
                      <span>🛏 {room.room_count} Rooms</span>
                    </div>

                    {/* CHECK IN / OUT (FIXED SAFE) */}
                    {(room.check_in_date || room.check_out_date) && (
                      <div style={{
                        marginTop: '14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {room.check_in_date && (
                          <span className="detail-tag">
                            <Calendar size={12} />
                            Check-in: {room.check_in_date}
                          </span>
                        )}

                        {room.check_out_date && (
                          <span className="detail-tag">
                            <Calendar size={12} />
                            Check-out: {room.check_out_date}
                          </span>
                        )}
                      </div>
                    )}

                    {/* AMENITIES */}
                    {room.amenities?.length > 0 && (
                      <div style={{
                        marginTop: '14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {room.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'rgba(6,182,212,.15)',
                              color: '#06B6D4',
                              fontSize: '12px'
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              ))}
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
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>

          <button onClick={onEdit} className="btn-primary">
            <Edit3 size={16} />
            <span>Edit Property</span>
          </button>
        </div>
      </div>
    </div>
  );
}