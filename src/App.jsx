
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HostLogin from "./pages/hostAuth/HostLogin";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import BookingsPage from "./pages/BookingsPage";
import HostRegister from "./pages/hostAuth/HostRegister";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("host_auth") === "true";
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("host_auth", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("host_auth");
  };

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1F2B",
            color: "#F0F2F5",
            border: "1px solid #2A3040",
            borderRadius: "10px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#00E5FF",
              secondary: "#0F172A",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HostLogin onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard/settings"
          element={
            isAuthenticated ? (
              <SettingsPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard/notifications"
          element={
            isAuthenticated ? (
              <NotificationsPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard/bookings"
          element={
            isAuthenticated ? (
              <BookingsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route 
          path="/register" 
          element={
          <HostRegister 
          />
          } />

        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

