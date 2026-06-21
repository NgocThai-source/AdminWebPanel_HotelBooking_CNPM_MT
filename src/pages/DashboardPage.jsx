import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostManagement from '../components/PostManagement';
import UserManagement from '../components/UserManagement';
import CustomerManagement from '../components/CustomerManagement';
import './DashboardPage.css';

const dict = {
  vi: {
    navPost: 'Quản lý bài đăng',
    navUser: 'Quản lý người dùng',
    navCustomer: 'Quản lý khách',

    postTitle: 'Quản lý bài đăng',
    postDesc: 'Kiểm duyệt các dự án lưu trú do đối tác yêu cầu đăng tải.',
    userTitle: 'Quản lý người dùng',
    userDesc: 'Phê duyệt các yêu cầu đăng ký tài khoản mới trên hệ thống.',

    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    locked: 'Đã khóa',

    approveBtn: 'Duyệt',
    rejectBtn: 'Từ chối',
    lockBtn: 'Khóa',
    unlockBtn: 'Mở khóa',
    logout: 'Đăng xuất',

    rooms: 'phòng khả dụng',
    night: '/ đêm',
    roleCus: 'Khách hàng',
    roleOwner: 'Chủ KS',
    rolePartner: 'Đối tác',

    customerTitle: 'Quản lý khách',
    customerDesc: 'Quản lý tài khoản khách hàng trên hệ thống.',
    customerRole: 'KHÁCH HÀNG',
    activeCustomer: 'Hoạt động',
    lockedCustomer: 'Đã khóa',
    allCustomer: 'Tất cả',

    searchCustomer: 'Tìm kiếm theo email...',
    searchUser: 'Tìm kiếm theo email...',
    searchPost: 'Tìm kiếm bài đăng...',

    loadingData: 'Đang tải dữ liệu...',
    noData: 'Không có dữ liệu trong mục này.',
    lockAccount: 'Khóa',
    unlockAccount: 'Mở khóa',
    deleteAccount: 'Xóa',
    hotelDetailTitle: 'Chi tiết khách sạn',
hotelDetailDesc: 'Xem thông tin đầy đủ trước khi duyệt.',
hotelInfo: 'Thông tin khách sạn',
roomList: 'Danh sách phòng',
category: 'Loại hình',
hostName: 'Tên chủ khách sạn',
reviewCount: 'Số đánh giá',
status: 'Trạng thái',
capacity: 'Sức chứa',
roomCount: 'Số lượng',
roomPrice: 'Giá phòng',
closeBtn: 'Đóng',
notAvailable: 'Chưa có',
noDescription: 'Chưa có mô tả.',
noAmenities: 'Chưa có tiện ích',
noRooms: 'Khách sạn này chưa có phòng.',
noHotelName: 'Chưa có tên',
noRoomName: 'Chưa có tên phòng',
noAddress: 'Chưa có địa chỉ',
  },

  en: {
    navPost: 'Post Management',
    navUser: 'User Management',
    navCustomer: 'Customer Management',

    postTitle: 'Post Management',
    postDesc: 'Review accommodation projects submitted by partners.',
    userTitle: 'User Management',
    userDesc: 'Approve new account registration requests on the system.',

    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    locked: 'Locked',

    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    lockBtn: 'Lock',
    unlockBtn: 'Unlock',
    logout: 'Logout',

    rooms: 'available rooms',
    night: '/ night',
    roleCus: 'Customer',
    roleOwner: 'Hotel Owner',
    rolePartner: 'Partner',

    customerTitle: 'Customer Management',
    customerDesc: 'Manage customer accounts on the system.',
    customerRole: 'CUSTOMER',
    activeCustomer: 'Active',
    lockedCustomer: 'Locked',
    allCustomer: 'All',

    searchCustomer: 'Search by email...',
    searchUser: 'Search by email...',
    searchPost: 'Search posts...',

    loadingData: 'Loading data...',
    noData: 'No data available.',
    lockAccount: 'Lock',
    unlockAccount: 'Unlock',
    deleteAccount: 'Delete',
    hotelDetailTitle: 'Hotel Details',
hotelDetailDesc: 'Review full information before approval.',
hotelInfo: 'Hotel Information',
roomList: 'Room List',
category: 'Category',
hostName: 'Hotel owner',
reviewCount: 'Reviews',
status: 'Status',
capacity: 'Capacity',
roomCount: 'Room count',
roomPrice: 'Room price',
closeBtn: 'Close',
notAvailable: 'Not available',
noDescription: 'No description.',
noAmenities: 'No amenities',
noRooms: 'This hotel has no rooms.',
noHotelName: 'No hotel name',
noRoomName: 'No room name',
noAddress: 'No address',
  },
};

export default function DashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('posts');

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('admin_lang') || 'vi';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin_theme') || 'theme-dark';
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const t = (key) => dict[lang][key] || key;

  useEffect(() => {
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('admin_lang', lang);
  }, [lang]);

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
        <div className="dashboard-bg-overlay" />

        <div className="dashboard-main-content">
          {activeTab === 'posts' ? (
            <PostManagement t={t} />
          ) : activeTab === 'users' ? (
            <UserManagement t={t} />
          ) : (
            <CustomerManagement t={t} />
          )}
        </div>
      </div>
    </div>
  );
}