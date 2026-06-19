import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Building2,
  UserPlus,
  Moon,
  Sun,
  Languages,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabaseClient";
import "./hostAuth.css";

function HostRegister() {
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("vi");
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    vi: {
      title: "Đăng ký tài khoản",
      subtitle: "Tạo tài khoản quản lý khách sạn",
      hotel: "Tên khách sạn",
      email: "Email",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      confirm: "Xác nhận mật khẩu",
      hotelPlace: "Nhập tên khách sạn",
      emailPlace: "Nhập email",
      usernamePlace: "Nhập tên đăng nhập",
      passwordPlace: "Nhập mật khẩu",
      confirmPlace: "Nhập lại mật khẩu",
      register: "Đăng ký",
      hasAccount: "Đã có tài khoản?",
      login: "Đăng nhập",
      empty: "Vui lòng nhập đầy đủ thông tin!",
      mismatch: "Mật khẩu xác nhận không khớp!",
      duplicate: "Email này đã được đăng ký!",
      success: "Đăng ký tài khoản thành công!",
      fail: "Đăng ký thất bại!",
    },
    en: {
      title: "Host Register",
      subtitle: "Create your hotel management account",
      hotel: "Hotel name",
      email: "Email",
      username: "Username",
      password: "Password",
      confirm: "Confirm password",
      hotelPlace: "Enter hotel name",
      emailPlace: "Enter email",
      usernamePlace: "Enter username",
      passwordPlace: "Enter password",
      confirmPlace: "Re-enter password",
      register: "Register",
      hasAccount: "Already have an account?",
      login: "Sign in",
      empty: "Please fill in all fields!",
      mismatch: "Confirm password does not match!",
      duplicate: "This email is already registered!",
      success: "Account registered successfully!",
      fail: "Registration failed!",
    },
  };

  const t = text[lang];

  const handleRegister = async (e) => {
    e.preventDefault();

    const hotelInput = hotelName.trim();
    const emailInput = email.trim().toLowerCase();
    const usernameInput = username.trim();
    const passwordInput = password.trim();
    const confirmInput = confirmPassword.trim();

    if (!hotelInput || !emailInput || !usernameInput || !passwordInput || !confirmInput) {
      toast.error(t.empty);
      return;
    }

    if (passwordInput !== confirmInput) {
      toast.error(t.mismatch);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("host_accounts").insert({
      hotel_name: hotelInput,
      email: emailInput,
      username: usernameInput,
      password: passwordInput,
    });

    setIsLoading(false);

    if (error) {
      console.log(error);

      if (error.code === "23505") {
        toast.error(t.duplicate);
      } else {
        toast.error(t.fail);
      }

      return;
    }

    toast.success(t.success);

    setTimeout(() => {
      navigate("/host/login");
    }, 1200);
  };

  return (
    <div className={`host-page ${theme === "dark" ? "host-dark" : "host-light"}`}>
      <div className="host-bg">
        <div className="host-bg-gradient" />
        <div className="host-bg-orb host-bg-orb-1" />
        <div className="host-bg-orb host-bg-orb-2" />
        <div className="host-bg-orb host-bg-orb-3" />
        <div className="host-bg-grid" />
      </div>

      <div className="host-tools">
        <button type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          {theme === "light" ? "Dark" : "Light"}
        </button>

        <button type="button" onClick={() => setLang(lang === "vi" ? "en" : "vi")}>
          <Languages size={17} />
          {lang === "vi" ? "EN" : "VI"}
        </button>
      </div>

      <div className="host-card host-card-register">
        <div className="host-logo-wrapper">
          <div className="host-logo">
            <Building2 size={38} />
          </div>
          <div className="host-logo-glow" />
        </div>

        <h1 className="host-title">{t.title}</h1>
        <p className="host-subtitle">{t.subtitle}</p>

        <form className="host-form" onSubmit={handleRegister}>
          <div className="host-field">
            <label className="host-label">{t.hotel}</label>
            <div className="host-input-wrapper">
              <Building2 className="host-input-icon" size={18} />
              <input
                className="host-input"
                type="text"
                placeholder={t.hotelPlace}
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="host-field">
            <label className="host-label">{t.email}</label>
            <div className="host-input-wrapper">
              <Mail className="host-input-icon" size={18} />
              <input
                className="host-input"
                type="email"
                placeholder={t.emailPlace}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="host-field">
            <label className="host-label">{t.username}</label>
            <div className="host-input-wrapper">
              <User className="host-input-icon" size={18} />
              <input
                className="host-input"
                type="text"
                placeholder={t.usernamePlace}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="host-field">
            <label className="host-label">{t.password}</label>
            <div className="host-input-wrapper">
              <Lock className="host-input-icon" size={18} />
              <input
                className="host-input"
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordPlace}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="host-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="host-field">
            <label className="host-label">{t.confirm}</label>
            <div className="host-input-wrapper">
              <Lock className="host-input-icon" size={18} />
              <input
                className="host-input"
                type={showConfirm ? "text" : "password"}
                placeholder={t.confirmPlace}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="host-eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="host-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="host-spinner" />
            ) : (
              <>
                <UserPlus size={18} /> {t.register}
              </>
            )}
          </button>
        </form>

        <p className="host-switch">
          {t.hasAccount} <Link to="/host/login">{t.login}</Link>
        </p>
      </div>
    </div>
  );
}

export default HostRegister;