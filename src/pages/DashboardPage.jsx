import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hotel,
  Plus,
  Search,
  LogOut,
  Trash2,
  Edit3,
  Eye,
  ChevronDown,
  Building2,
  X,
  RefreshCw,
  MapPin,
  Settings,
  Star,
  Bell,
  Bed
} from 'lucide-react';
import toast from 'react-hot-toast';
import { hotelApi } from '../services/api';
import HotelFormModal from '../components/HotelFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import HotelDetailModal from '../components/HotelDetailModal';
import './DashboardPage.css';


export default function DashboardPage({ onLogout }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [deletingHotel, setDeletingHotel] = useState(null);
  const [viewingHotel, setViewingHotel] = useState(null);
  const navigate = useNavigate();

  const categories = ['All', 'Hotel', 'Resort', 'Homestay', 'Villa', 'Boutique', 'Luxury'];

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await hotelApi.getAll();
      setHotels(data || []);
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      toast.error('Failed to load hotels. Is the backend running?');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleCreate = () => {
    setEditingHotel(null);
    setShowFormModal(true);
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setShowFormModal(true);
  };

  const handleView = (hotel) => {
    setViewingHotel(hotel);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (hotel) => {
    setDeletingHotel(hotel);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHotel) return;
    try {
      await hotelApi.delete(deletingHotel.id);
      toast.success('Hotel deleted successfully');
      setShowDeleteModal(false);
      setDeletingHotel(null);
      fetchHotels();
    } catch (err) {
      toast.error('Failed to delete hotel');
    }
  };

 const handleFormSave = async (hotelData) => {
  try {
    if (editingHotel) {
      // 1. update hotel
      await hotelApi.update(editingHotel.id, hotelData);

      // 2. update rooms nếu có
      if (hotelData.rooms?.length > 0) {
        for (const room of hotelData.rooms) {
          if (room.id) {
            // update room
            await roomsApi.updateRoom(room.id, {
              room_name: room.room_name,
              room_type: room.room_type,
              capacity: Number(room.capacity),
              price_per_night: Number(room.price_per_night),
              room_count: Number(room.room_count),
              image_url: room.image_url,
              description: room.description,

              // 🔥 quan trọng
              check_in_date: room.check_in_date,
              check_out_date: room.check_out_date,
            });
          } else {
            // create room mới
            await roomsApi.createRoom({
              hotel_id: editingHotel.id,
              room_name: room.room_name,
              room_type: room.room_type,
              capacity: Number(room.capacity),
              price_per_night: Number(room.price_per_night),
              room_count: Number(room.room_count),
              image_url: room.image_url,
              description: room.description,
              check_in_date: room.check_in_date,
              check_out_date: room.check_out_date,
            });
          }
        }
      }

      toast.success('Updated successfully');
    } else {
      const createdHotel = await hotelApi.create(hotelData);

      if (hotelData.rooms?.length > 0) {
        const roomsData = hotelData.rooms.map(room => ({
          hotel_id: createdHotel.id,
          room_name: room.room_name,
          room_type: room.room_type,
          capacity: Number(room.capacity),
          price_per_night: Number(room.price_per_night),
          room_count: Number(room.room_count),
          image_url: room.image_url,
          description: room.description,
          check_in_date: room.check_in_date,
          check_out_date: room.check_out_date,
        }));

        await hotelApi.createRooms(roomsData);
      }

      toast.success('Created successfully');
    }

    setShowFormModal(false);
    setEditingHotel(null);
    fetchHotels();

  } catch (err) {
    toast.error(err.message || 'Failed to save');
  }
};

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Filter hotels
  const filteredHotels = hotels.filter((h) => {
    const matchSearch =
      h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || h.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Stats
  const totalHotels = hotels.length;
  const avgPrice = hotels.length
    ? (hotels.reduce((sum, h) => sum + (h.price || 0), 0) / hotels.length).toFixed(0)
    : 0;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand">Admin Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          <a className="sidebar-link sidebar-link--active" href="#dashboard">
            <Hotel size={18} />
            <span>Hotel Management</span>
          </a>
          <a className="sidebar-link" href="#hotels">
            <Building2 size={18} />
            <span>Properties</span>
          </a>
          <a
            className="sidebar-link"
            href="/dashboard/bookings"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard/bookings");
            }}
          >
            <Bed size={18} />
            <span>Booked Rooms</span>
          </a>
          <a className="sidebar-link" href="/dashboard/settings" onClick={(e) => { e.preventDefault(); navigate('/dashboard/settings'); }}>
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <a className="sidebar-link" href="/dashboard/notifications" onClick={(e) => { e.preventDefault(); navigate('/dashboard/notifications'); }}>
            <Bell size={18} />
            <span>Notifications</span>
          </a>
        </nav>
        

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Property Management</h1>
            <p className="dash-subtitle">Manage your hotels, resorts, and homestays</p>
          </div>
          <div className="dash-header-actions">
            <button onClick={fetchHotels} className="btn-icon" title="Refresh">
              <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
            </button>
            <button onClick={handleCreate} className="btn-primary" id="create-hotel-btn">
              <Plus size={18} />
              <span>Add Property</span>
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="stats-row animate-fade-in">
          <div className="stat-card">
            <div className="stat-icon stat-icon--cyan">
              <Building2 size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalHotels}</span>
              <span className="stat-label">Total Properties</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--green">
              <MapPin size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{avgPrice}</span>
              <span className="stat-label">Avg. Price/Night ($)</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties by name or location..."
              className="search-input"
              id="search-hotels"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="category-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`chip ${selectedCategory === cat ? 'chip--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="hotels-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'All' ? 'All Properties' : selectedCategory}
              <span className="section-count">{filteredHotels.length}</span>
            </h2>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton--img" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--text-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="empty-state">
              <Building2 size={48} strokeWidth={1} />
              <h3>No properties found</h3>
              <p>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Click "Add Property" to create your first listing'}
              </p>
              {!searchQuery && (
                <button onClick={handleCreate} className="btn-primary">
                  <Plus size={18} />
                  <span>Add Your First Property</span>
                </button>
              )}
            </div>
          ) : (
            <div className="hotels-grid">
              {filteredHotels.map((hotel, index) => (
                <div
                  key={hotel.id}
                  className="hotel-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="hotel-card-img-wrapper">
                    {hotel.image_url ? (
                      <img src={hotel.image_url} alt={hotel.title} className="hotel-card-img" />
                    ) : (
                      <div className="hotel-card-img-placeholder">
                        <Hotel size={32} />
                      </div>
                    )}
                    <div className="hotel-card-overlay">
                      <button onClick={() => handleView(hotel)} className="card-action-btn" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleEdit(hotel)} className="card-action-btn" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(hotel)} className="card-action-btn card-action-btn--danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="hotel-card-body">
                    <div className="hotel-card-header">
                      <h3 className="hotel-card-title">{hotel.title}</h3>
                      <span className="hotel-card-price">${hotel.price || 0}</span>
                    </div>
                    <div className="hotel-card-location">
                      <MapPin size={13} />
                      <span>{hotel.location}</span>
                    </div>
                    {hotel.rating > 0 && (
                      <div className="hotel-card-location" style={{ color: '#f59e0b', marginTop: '2px' }}>
                        <Star size={13} fill="#f59e0b" />
                        <span style={{ marginLeft: '3px' }}>{Number(hotel.rating).toFixed(1)}</span>
                        {hotel.review_count > 0 && (
                          <span style={{ color: '#9ca3af', marginLeft: '2px' }}>({hotel.review_count})</span>
                        )}
                      </div>
                    )}
                    <div className="hotel-card-meta">
                      <span className="hotel-card-category">{hotel.category || 'Hotel'}</span>
                      {hotel.check_in_date && (
                        <span className="hotel-card-date">
                          Check-in: {hotel.check_in_date}
                        </span>
                      )}
                      {hotel.check_out_date && (
                        <span className="hotel-card-date">
                          Check-out: {hotel.check_out_date}
                        </span>
                      )}
                    </div>
                    {hotel.description && (
                      <p className="hotel-card-description">{hotel.description}</p>
                    )}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="hotel-card-amenities">
                        {hotel.amenities.map((amenity, idx) => (
                          <span key={idx} className="hotel-card-amenity-tag">
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showFormModal && (
        <HotelFormModal
          hotel={editingHotel}
          onSave={handleFormSave}
          onClose={() => { setShowFormModal(false); setEditingHotel(null); }}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          hotelName={deletingHotel?.title}
          onConfirm={handleDeleteConfirm}
          onClose={() => { setShowDeleteModal(false); setDeletingHotel(null); }}
        />
      )}
      {showDetailModal && (
        <HotelDetailModal
          hotel={viewingHotel}
          onClose={() => { setShowDetailModal(false); setViewingHotel(null); }}
          onEdit={() => { setShowDetailModal(false); handleEdit(viewingHotel); }}
        />
      )}
    </div>
  );
}
