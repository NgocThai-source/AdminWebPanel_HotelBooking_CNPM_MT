import { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Building2,
  Tag,
  Type,
  FileText,
  Calendar,
  Loader,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { hotelApi } from '../services/api';
import toast from 'react-hot-toast';
import './HotelFormModal.css';

const CATEGORIES = ['Hotel', 'Resort', 'Homestay', 'Villa', 'Boutique', 'Luxury'];

const ALL_AMENITIES = [
  'wifi', 'pool', 'gym', 'restaurant', 'parking', 'ac', 'tv', 'spa', 'beach', 'bar'
];

export default function HotelFormModal({ hotel, onSave, onClose }) {
  const isEditing = Boolean(hotel);
  const fileInputRef = useRef(null);
  const roomFileRefs = useRef([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(hotel?.image_url || '');
  const [form, setForm] = useState({
    title: hotel?.title || '',
    location: hotel?.location || '',
    description: hotel?.description || '',
    imageUrl: hotel?.image_url || '',
    price: hotel?.price || '',
    category: hotel?.category || 'Hotel',
    hostName: hotel?.host_name || 'Admin',
    hostAvatarUrl: hotel?.host_avatar_url || '',
    amenities: hotel?.amenities || [],
    checkInDate: hotel?.check_in_date || '',
    checkOutDate: hotel?.check_out_date || '',
  });

  const [rooms, setRooms] = useState(
    hotel?.rooms?.length
      ? hotel.rooms
      : [
          {
            room_name: '',
            room_type: '',
            capacity: 1,
            price_per_night: '',
            room_count: 1,
            image_url: '',
            description: '',
          }
        ]
  );

  const selectedAmenities = form.amenities || [];

  const toggleAmenity = (amenity) => {
    const current = form.amenities || [];
    if (current.includes(amenity)) {
      handleChange('amenities', current.filter(a => a !== amenity));
    } else {
      if (current.length >= 4) {
        toast.error('You can only select up to 4 amenities');
        return;
      }
      handleChange('amenities', [...current, amenity]);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        room_name: '',
        room_type: '',
        capacity: 1,
        price_per_night: '',
        room_count: 1,
        image_url: '',
        description: '',
      }
    ]);
  };

  const removeRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleRoomChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };
  const handleRoomImageUpload = async (index, e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    handleRoomChange(
      index,
      'image_url',
      reader.result
    );
  };

  reader.readAsDataURL(file);

  try {
    const url = await hotelApi.uploadImage(file);

    handleRoomChange(
      index,
      'image_url',
      url
    );

    toast.success('Room image uploaded!');
  } catch (err) {
    toast.error('Failed to upload room image');
  }
};

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const url = await hotelApi.uploadImage(file);
      handleChange('imageUrl', url);
      setPreviewUrl(url);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed. Using URL input instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlChange = (url) => {
    handleChange('imageUrl', url);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Property name is required');
      return;
    }
    if (!form.location.trim()) {
      toast.error('Location is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price) || 0,
        rooms: rooms.map(room => ({
          ...room,
          capacity: Number(room.capacity),
          room_count: Number(room.room_count),
          price_per_night: Number(room.price_per_night) || 0,
        }))
      });
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Image Upload Section */}
          <div className="form-section">
            <label className="form-label">
              <ImageIcon size={14} /> Property Image
            </label>
            <div className="image-upload-area">
              {previewUrl ? (
                <div className="image-preview-wrapper">
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => { setPreviewUrl(''); handleChange('imageUrl', ''); }}
                    className="image-remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="image-upload-btn"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader size={24} className="spin-animation" />
                  ) : (
                    <Upload size={24} />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                  <span className="image-upload-hint">JPEG, PNG, WebP (max 10MB)</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div className="image-url-fallback">
              <span className="form-hint">Or enter image URL:</span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/hotel-image.jpg"
                className="form-input form-input--sm"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-grid">
            <div className="form-field form-field--full">
              <label className="form-label">
                <Type size={14} /> Property Name *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. The Azure Grand Resort"
                className="form-input"
                required
                autoFocus={!isEditing}
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <MapPin size={14} /> Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Maldives"
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Building2 size={14} /> Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                <DollarSign size={14} /> Price per Night ($)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0"
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Calendar size={14} /> Check-in Available
              </label>
              <input
                type="date"
                value={form.checkInDate}
                onChange={(e) => handleChange('checkInDate', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Calendar size={14} /> Check-out Available
              </label>
              <input
                type="date"
                value={form.checkOutDate}
                onChange={(e) => handleChange('checkOutDate', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <Tag size={14} /> Host Name
              </label>
              <input
                type="text"
                value={form.hostName}
                onChange={(e) => handleChange('hostName', e.target.value)}
                placeholder="Admin"
                className="form-input"
              />
            </div>

            <div className="form-field form-field--full">
              <label className="form-label">
                <FileText size={14} /> Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the property..."
                className="form-textarea"
                rows={3}
              />
            </div>

            {/* Amenities Multi-Select */}
            <div className="form-field form-field--full">
              <label className="form-label">
                <Tag size={14} /> Top Amenities (select all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {ALL_AMENITIES.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  const isDisabled = !isSelected && selectedAmenities.length >= 4;
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      disabled={isDisabled}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: `1.5px solid ${isSelected ? 'var(--cyan-main)' : isDisabled ? 'var(--border)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--cyan-main)' : 'transparent',
                        color: isSelected ? '#fff' : isDisabled ? 'var(--border)' : 'var(--text-secondary)',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      {isSelected && <Check size={12} />}
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="rooms-section">
          <div className="rooms-header">
            <h3 className="rooms-title">Rooms</h3>

            <button
              type="button"
              className="btn-add-room"
              onClick={addRoom}
            >
              <Plus size={16} />
              Add Room
            </button>
          </div>

          {rooms.map((room, index) => (
            <div className="room-card" key={index}>
              <div className="room-card-header">
                <h4 className="room-card-title">
                  Room {index + 1}
                </h4>

                {rooms.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-room"
                    onClick={() => removeRoom(index)}
                  >
                    <>
                      <Trash2 size={14} />
                      Remove
                    </>
                  </button>
                )}
              </div>
              <div className="form-field form-field--full">
              <label className="form-label">
                <ImageIcon size={14} />
                Room Image
              </label>

              <div className="room-image-upload">

                {room.image_url ? (
                  <div className="room-image-preview">
                    <img
                      src={room.image_url}
                      alt="Room"
                    />

                    <button
                      type="button"
                      className="image-remove"
                      onClick={() =>
                        handleRoomChange(index, 'image_url', '')
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="room-upload-btn"
                    onClick={() =>
                      roomFileRefs.current[index]?.click()
                    }
                  >
                    <Upload size={20} />

                    <span>Upload Room Image</span>
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (roomFileRefs.current[index] = el)}
                  style={{ display: 'none' }}
                  onChange={(e) =>
                    handleRoomImageUpload(index, e)
                  }
                />

              </div>
            </div>

              <div className="room-grid">

                <div className="form-field">
                  <label className="form-label">Room Name</label>

                  <input
                    type="text"
                    className="form-input"
                    value={room.room_name}
                    onChange={(e) =>
                      handleRoomChange(index, 'room_name', e.target.value)
                    }
                    placeholder="Deluxe Room"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Room Type</label>

                  <input
                    type="text"
                    className="form-input"
                    value={room.room_type}
                    onChange={(e) =>
                      handleRoomChange(index, 'room_type', e.target.value)
                    }
                    placeholder="Double"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Capacity</label>

                  <input
                    type="number"
                    className="form-input"
                    value={room.capacity}
                    min="1"
                    onChange={(e) =>
                      handleRoomChange(index, 'capacity', e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Price/Night</label>

                  <input
                    type="number"
                    className="form-input"
                    value={room.price_per_night}
                    min="0"
                    onChange={(e) =>
                      handleRoomChange(index, 'price_per_night', e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Quantity</label>

                  <input
                    type="number"
                    className="form-input"
                    value={room.room_count}
                    min="1"
                    onChange={(e) =>
                      handleRoomChange(index, 'room_count', e.target.value)
                    }
                  />
                </div>

                <div className="form-field form-field--full">
                  <label className="form-label">Room Description</label>

                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={room.description}
                    onChange={(e) =>
                      handleRoomChange(index, 'description', e.target.value)
                    }
                    placeholder="Describe this room..."
                  />
                </div>

              </div>
            </div>
          ))}
        </div>
          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader size={16} className="spin-animation" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Property' : 'Publish Property'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
