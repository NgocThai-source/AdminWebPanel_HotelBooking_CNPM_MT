import {
  X, MapPin, DollarSign, Building2, Calendar,
  Edit3, Hotel, Star
} from 'lucide-react';
import './HotelFormModal.css';

export default function HotelDetailModal({ hotel, onClose, onEdit }) {
  if (!hotel) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {hotel.image_url ? (
          <img src={hotel.image_url} alt={hotel.title} className="detail-modal-img" />
        ) : (
          <div className="detail-modal-img-placeholder">
            <Hotel size={48} />
          </div>
        )}

        {/* Body */}
        <div className="detail-modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2>{hotel.title}</h2>
              <div className="detail-location">
                <MapPin size={14} />
                <span>{hotel.location}</span>
              </div>
            </div>
            <button onClick={onClose} className="modal-close" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="detail-stats">
            <div className="detail-stat">
              <span className="detail-stat-value" style={{ color: 'var(--cyan-main)' }}>
                ${hotel.price || 0}
              </span>
              <span className="detail-stat-label">Per Night ($)</span>
            </div>
            {hotel.rating > 0 && (
              <div className="detail-stat">
                <span className="detail-stat-value" style={{ color: '#f59e0b' }}>
                  {Number(hotel.rating).toFixed(1)}
                </span>
                <span className="detail-stat-label">
                  <Star size={10} fill="#f59e0b" color="#f59e0b" style={{ marginRight: '2px' }} />
                  Rating {hotel.review_count > 0 ? `(${hotel.review_count} reviews)` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {hotel.description && (
            <p className="detail-description">{hotel.description}</p>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Top Amenities</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {hotel.amenities.map((amenity, idx) => (
                  <span key={idx} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: 'var(--cyan-surface)',
                    color: 'var(--cyan-main)',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta Tags */}
          <div className="detail-meta">
            <span className="detail-tag">
              <Building2 size={12} /> {hotel.category || 'Hotel'}
            </span>
            {hotel.check_in_date && (
              <span className="detail-tag">
                <Calendar size={12} /> Check-in: {hotel.check_in_date}
              </span>
            )}
            {hotel.check_out_date && (
              <span className="detail-tag">
                <Calendar size={12} /> Check-out: {hotel.check_out_date}
              </span>
            )}
            {hotel.host_name && (
              <span className="detail-tag">
                Host: {hotel.host_name}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="detail-modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={onEdit} className="btn-primary">
            <Edit3 size={16} />
            <span>Edit Property</span>
          </button>
        </div>
      </div>
    </div>
  );
}
