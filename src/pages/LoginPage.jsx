import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import './LoginPage.css';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      toast.success('Welcome back, Admin!');
      onLogin();
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-bg-orb login-bg-orb--1" />
        <div className="login-bg-orb login-bg-orb--2" />
        <div className="login-bg-orb login-bg-orb--3" />
        <div className="login-bg-grid" />
      </div>

      <div className={`login-card ${shake ? 'login-card--shake' : ''}`}>
        {/* Logo */}
        <div className="login-logo-wrapper">
          <img src="/logo.png" alt="Hotel Booking App" className="login-logo" />
          <div className="login-logo-glow" />
        </div>

        <h1 className="login-title">Admin Panel</h1>
        <p className="login-subtitle">Hotel Booking Management System</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className="login-field">
            <label htmlFor="username" className="login-label">Username</label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size={18} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="login-input"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="login-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-eye-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="login-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <p className="login-footer">
          Protected admin area &bull; Hotel Booking App &copy; 2026
        </p>
      </div>
    </div>
  );
}
