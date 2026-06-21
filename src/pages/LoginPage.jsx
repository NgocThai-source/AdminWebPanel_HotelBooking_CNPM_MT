import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  LogIn,
  Building2,
  Moon,
  Sun,
  Languages,
} from 'lucide-react';
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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin_login_theme') || 'light';
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('admin_login_lang') || 'vi';
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('admin_login_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('admin_login_lang', lang);
  }, [lang]);

  const text = {
    vi: {
      title: 'Đăng nhập Admin',
      subtitle: 'Hệ thống quản lý đặt phòng khách sạn',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      usernamePlace: 'Nhập tên đăng nhập',
      passwordPlace: 'Nhập mật khẩu',
      signIn: 'Đăng nhập',
      empty: 'Vui lòng nhập đầy đủ thông tin!',
      success: 'Đăng nhập Admin thành công!',
      fail: 'Tên đăng nhập hoặc mật khẩu không đúng!',
      footer: 'Khu vực bảo mật Admin • Hotel Booking App © 2026',
    },
    en: {
      title: 'Admin Login',
      subtitle: 'Hotel Booking Management System',
      username: 'Username',
      password: 'Password',
      usernamePlace: 'Enter username',
      passwordPlace: 'Enter password',
      signIn: 'Sign In',
      empty: 'Please enter all information!',
      success: 'Admin login successful!',
      fail: 'Username or password is incorrect!',
      footer: 'Protected admin area • Hotel Booking App © 2026',
    },
  };

  const t = text[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error(t.empty);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      toast.success(t.success);
      onLogin();
      navigate('/dashboard');
    } else {
      toast.error(t.fail);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setIsLoading(false);
  };

  return (
    <div className={`admin-page ${theme === 'dark' ? 'admin-dark' : 'admin-light'}`}>
      <div className="admin-bg">
        <div className="admin-bg-gradient" />
        <div className="admin-bg-orb admin-bg-orb-1" />
        <div className="admin-bg-orb admin-bg-orb-2" />
        <div className="admin-bg-orb admin-bg-orb-3" />
        <div className="admin-bg-grid" />
      </div>

      <div className="admin-tools">
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>

        <button
          type="button"
          onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        >
          <Languages size={17} />
          {lang === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>

      <div className={`admin-card ${shake ? 'admin-card-shake' : ''}`}>
        <div className="admin-logo-wrapper">
          <div className="admin-logo">
            <Building2 size={38} />
          </div>
          <div className="admin-logo-glow" />
        </div>

        <h1 className="admin-title">{t.title}</h1>
        <p className="admin-subtitle">{t.subtitle}</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label">{t.username}</label>
            <div className="admin-input-wrapper">
              <User className="admin-input-icon" size={18} />
              <input
                className="admin-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlace}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">{t.password}</label>
            <div className="admin-input-wrapper">
              <Lock className="admin-input-icon" size={18} />
              <input
                className="admin-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlace}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="admin-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                {t.signIn}
              </>
            )}
          </button>
        </form>

        <p className="admin-footer">{t.footer}</p>
      </div>
    </div>
  );
}