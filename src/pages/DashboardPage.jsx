import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostManagement from '../components/PostManagement';
import UserManagement from '../components/UserManagement';
import './DashboardPage.css';
import CustomerManagement from '../components/CustomerManagement';

const dict = {
  vi: {
    navPost: 'Quản lý bài đăng',
    navUser: 'Quản lý người dùng',
    postTitle: 'Quản lý bài đăng',
    postDesc: 'Kiểm duyệt các dự án lưu trú do đối tác yêu cầu đăng tải.',
    userTitle: 'Quản lý người dùng',
    userDesc: 'Phê duyệt các yêu cầu đăng ký tài khoản mới trên hệ thống.',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    approveBtn: 'Duyệt',
    rejectBtn: 'Từ chối',
    logout: 'Đăng xuất',
    rooms: 'phòng khả dụng',
    night: '/ đêm',
    roleCus: 'Khách hàng',
    roleOwner: 'Chủ KS',
    rolePartner: 'Đối tác',
    locked: 'Đã khóa',
lockBtn: 'Khóa',
unlockBtn: 'Mở khóa',
navCustomer: 'Quản lý khách',
  },
  en: {
    navPost: 'Post Management',
    navUser: 'User Management',
    postTitle: 'Post Management',
    postDesc: 'Review accommodation projects submitted by partners.',
    userTitle: 'User Management',
    userDesc: 'Approve new account registration requests on the system.',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    logout: 'Logout',
    rooms: 'available rooms',
    night: '/ night',
    roleCus: 'Customer',
    roleOwner: 'Hotel Owner',
    rolePartner: 'Partner',
    locked: 'Locked',
lockBtn: 'Lock',
unlockBtn: 'Unlock',
navCustomer: 'Customer Management',
  },
};

export default function DashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [lang, setLang] = useState('vi');
  const [theme, setTheme] = useState('theme-dark');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const t = (key) => dict[lang][key];

  return (
    <div className={`dashboard-wrapper ${theme}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        t={t}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="dashboard-content">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="dashboard-video"
        >
          <source src="/video/city.mp4" type="video/mp4" />
        </video>

        <div className="dashboard-bg-overlay" />

        <div className="dashboard-main-content">
          {
  activeTab === 'posts' ? (
    <PostManagement t={t} />
  ) : activeTab === 'users' ? (
    <UserManagement t={t} />
  ) : (
    <CustomerManagement t={t} />
  )
}
        </div>
      </div>
    </div>
  );
}