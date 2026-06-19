import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabaseClient";
import "./hostAuth.css";

function HostLogin({ onLogin }) {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("vi");
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    vi: {
      title: "Đăng nhập",
      subtitle: "Hệ thống quản lý khách sạn",
      username: "Email hoặc tên đăng nhập",
      password: "Mật khẩu",
      usernamePlace: "Nhập email hoặc tên đăng nhập",
      passwordPlace: "Nhập mật khẩu",
      forgot: "Quên mật khẩu?",
      login: "Đăng nhập",
      noAccount: "Chưa có tài khoản?",
      register: "Đăng ký ngay",
      footer: "Khu vực bảo mật cho Host • Hotel Booking App © 2026",
      empty: "Vui lòng nhập đầy đủ thông tin!",
      success: "Đăng nhập thành công!",
      fail: "Email/tên đăng nhập hoặc mật khẩu không đúng!",
      systemError: "Có lỗi xảy ra, vui lòng thử lại!",
      pending: "Tài khoản của bạn đang chờ Admin duyệt!",
      rejected: "Tài khoản của bạn đã bị từ chối!",
      locked: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin!",
    },
    en: {
      title: "Host Login",
      subtitle: "Hotel Booking Management System",
      username: "Email or username",
      password: "Password",
      usernamePlace: "Enter email or username",
      passwordPlace: "Enter password",
      forgot: "Forgot password?",
      login: "Sign In",
      noAccount: "Don't have an account?",
      register: "Register now",
      footer: "Protected host area • Hotel Booking App © 2026",
      empty: "Please enter all information!",
      success: "Login successful!",
      fail: "Email/username or password is incorrect!",
      systemError: "Something went wrong, please try again!",
      pending: "Your account is waiting for Admin approval!",
      rejected: "Your account has been rejected!",
      locked: "Your account has been locked. Please contact Admin!",
    },
  };

  const t = text[lang];

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginInput = loginValue.trim().toLowerCase();
    const passwordInput = password.trim();

    if (!loginInput || !passwordInput) {
      toast.error(t.empty);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from("host_accounts")
      .select("*")
      .or(`email.eq.${loginInput},username.eq.${loginInput}`)
      .eq("password", passwordInput)
      .maybeSingle();

    setIsLoading(false);

    if (error) {
      console.log(error);
      toast.error(t.systemError);
      return;
    }

    if (!data) {
      toast.error(t.fail);
      return;
    }

    const status = data.status || "pending";

    if (status === "locked") {
      toast.error(t.locked);
      return;
    }

    if (status === "rejected") {
      toast.error(t.rejected);
      return;
    }

    if (status !== "approved") {
      toast.error(t.pending);
      return;
    }

    localStorage.setItem("host_auth", "true");
    localStorage.setItem("host_id", data.id);
    localStorage.setItem("host_email", data.email);
    localStorage.setItem("host_username", data.username);
    localStorage.setItem("hotel_name", data.hotel_name);

    toast.success(t.success);

    if (onLogin) {
      onLogin();
    }

    navigate("/dashboard");
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
        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          {theme === "light" ? "Dark" : "Light"}
        </button>

        <button
          type="button"
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
        >
          <Languages size={17} />
          {lang === "vi" ? "EN" : "VI"}
        </button>
      </div>

      <div className="host-card">
        <div className="host-logo-wrapper">
          <div className="host-logo">
            <Building2 size={38} />
          </div>
          <div className="host-logo-glow" />
        </div>

        <h1 className="host-title">{t.title}</h1>
        <p className="host-subtitle">{t.subtitle}</p>

        <form className="host-form" onSubmit={handleLogin}>
          <div className="host-field">
            <label className="host-label">{t.username}</label>

            <div className="host-input-wrapper">
              <User className="host-input-icon" size={18} />

              <input
                className="host-input"
                type="text"
                placeholder={t.usernamePlace}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
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

          <div className="host-forgot">
            <a href="#">{t.forgot}</a>
          </div>

          <button type="submit" className="host-submit" disabled={isLoading}>
            {isLoading ? (
              <span className="host-spinner" />
            ) : (
              <>
                <LogIn size={18} /> {t.login}
              </>
            )}
          </button>
        </form>

        <p className="host-switch">
          {t.noAccount} <Link to="/register">{t.register}</Link>
        </p>

        <p className="host-footer">{t.footer}</p>
      </div>
    </div>
  );
}

export default HostLogin;