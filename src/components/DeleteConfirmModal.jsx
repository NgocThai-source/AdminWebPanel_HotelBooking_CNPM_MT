import { Trash2, X } from 'lucide-react';
import './HotelFormModal.css';

export default function DeleteConfirmModal({ hotelName, onConfirm, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container delete-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Confirm Deletion</h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-body">
          <div className="delete-icon-wrapper">
            <Trash2 size={24} />
          </div>
          <h3>Delete this property?</h3>
          <p>
            Are you sure you want to delete{' '}
            <span className="hotel-name-highlight">"{hotelName}"</span>?
            This action cannot be undone and the property will be removed from
            the mobile app immediately.
          </p>
        </div>

        <div className="delete-modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">
            <Trash2 size={16} />
            <span>Delete Property</span>
          </button>
        </div>
      </div>
    </div>
  );
}
