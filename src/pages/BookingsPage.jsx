import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hotel,
  Building2,
  Bed,
  Settings,
  Bell,
  LogOut,
  Search,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingsApi } from "../services/bookingsApi";
import "./DashboardPage.css";

export default function BookingsPage({ onLogout }) {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

const fetchBookings = useCallback(async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      console.log("No login data found");
      setBookings([]);
      return;
    }

    const data = await bookingsApi.getAll(user.id, token);

    setBookings(data || []);
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to load bookings");
    setBookings([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.hotel_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.booking_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.total_price || 0),
    0
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand">Admin Dashboard</span>
        </div>

        <nav className="sidebar-nav">
          <a
            className="sidebar-link"
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            <Hotel size={18} />
            <span>Hotel Management</span>
          </a>

          <a className="sidebar-link">
            <Building2 size={18} />
            <span>Properties</span>
          </a>

          <a className="sidebar-link sidebar-link--active">
            <Bed size={18} />
            <span>Booked Rooms</span>
          </a>

          <a
            className="sidebar-link"
            onClick={() => navigate("/dashboard/settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </a>

          <a
            className="sidebar-link"
            onClick={() => navigate("/dashboard/notifications")}
          >
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

      {/* Main */}
      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Booked Rooms</h1>
            <p className="dash-subtitle">
              Manage all hotel bookings and reservations
            </p>
          </div>

          <div className="dash-header-actions">
            <button onClick={fetchBookings} className="btn-icon">
              <RefreshCw
                size={18}
                className={loading ? "spin-animation" : ""}
              />
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon stat-icon--cyan">
              <Bed size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalBookings}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon--green">
              <DollarSign size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">${totalRevenue}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by guest, hotel, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="settings-card">
          <div className="settings-section">
            {loading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <div className="empty-state">
                <Bed size={48} strokeWidth={1} />
                <h3>No bookings found</h3>
                <p>No reservation data available</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.booking_id}</td>
                      <td>{booking.guest_name}</td>
                      <td>{booking.hotel_title}</td>
                      <td>{booking.check_in_date}</td>
                      <td>{booking.check_out_date}</td>
                      <td>${booking.total_price}</td>
                      <td>{booking.payment_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}