import { Routes, Route, Navigate } from "react-router-dom";
import HostLogin from "./HostLogin";
import HostRegister from "./HostRegister";
import "./hostAuth.css";

function AppHost() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />

      <Route path="login" element={<HostLogin />} />
      <Route path="register" element={<HostRegister />} />
    </Routes>
  );
}

export default AppHost;