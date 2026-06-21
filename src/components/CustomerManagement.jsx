import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Clock3,
  Search,
  MoreVertical,
  Trash2,
  LockKeyhole,
  UnlockKeyhole,
} from "lucide-react";

import toast from "react-hot-toast";
import { supabase } from "../services/supabaseClient";
import "./UserManagement.css";

export default function CustomerManagement({ t }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("active");
  const [searchEmail, setSearchEmail] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profile_users")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.log(error);
      toast.error(t("loadCustomerFail") || "Không tải được dữ liệu khách hàng!");
      return;
    }

    setCustomers(data || []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDeleteCustomer") || "Bạn có chắc muốn xóa khách hàng này?"
    );

    if (!confirmDelete) return;

    setProcessingId(id);

    const { error } = await supabase
      .from("profile_users")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      toast.error(t("deleteFail") || "Xóa thất bại!");
      setProcessingId(null);
      return;
    }

    setCustomers((prev) => prev.filter((item) => item.id !== id));
    setOpenMenuId(null);
    setProcessingId(null);
    toast.success(t("deleteCustomerSuccess") || "Đã xóa khách hàng!");
  };

  const handleLock = async (id) => {
    setProcessingId(id);

    const { error } = await supabase
      .from("profile_users")
      .update({ status: "locked" })
      .eq("id", id);

    if (error) {
      console.log(error);
      toast.error(t("lockCustomerFail") || "Khóa tài khoản khách thất bại!");
      setProcessingId(null);
      return;
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "locked" } : item
      )
    );

    setOpenMenuId(null);
    setProcessingId(null);
    toast.success(t("lockCustomerSuccess") || "Đã khóa tài khoản khách!");
  };

  const handleUnlock = async (id) => {
    setProcessingId(id);

    const { error } = await supabase
      .from("profile_users")
      .update({ status: "active" })
      .eq("id", id);

    if (error) {
      console.log(error);
      toast.error(t("unlockCustomerFail") || "Mở khóa tài khoản khách thất bại!");
      setProcessingId(null);
      return;
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "active" } : item
      )
    );

    setOpenMenuId(null);
    setProcessingId(null);
    toast.success(t("unlockCustomerSuccess") || "Đã mở khóa tài khoản khách!");
  };

  const displayedCustomers = customers.filter((customer) => {
    const status = customer.status || "active";

    const matchStatus =
      filter === "active"
        ? status === "active"
        : filter === "locked"
        ? status === "locked"
        : true;

    const matchEmail = (customer.email || "")
      .toLowerCase()
      .includes(searchEmail.trim().toLowerCase());

    return matchStatus && matchEmail;
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDateTime = (value) => {
    if (!value) return t("noTime") || "Chưa có thời gian";
    return new Date(value).toLocaleString("vi-VN");
  };

  return (
    <div className="user-management-container">
      <div className="user-top-row">
        <div className="header-titles">
          <h1>{t("customerTitle")}</h1>
          <p>{t("customerDesc")}</p>
        </div>

        <div className="user-search-box">
          <Search size={18} />
          <input
            placeholder={t("searchCustomer")}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-pills">
        <button
          className={`pill ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          {t("activeCustomer")}
        </button>

        <button
          className={`pill ${filter === "locked" ? "active" : ""}`}
          onClick={() => setFilter("locked")}
        >
          {t("lockedCustomer")}
        </button>

        <button
          className={`pill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t("allCustomer")}
        </button>
      </div>

      <div className="user-grid">
        {loading ? (
          <p
            style={{
              color: "var(--text-desc)",
              gridColumn: "1 / -1",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            {t("loadingData")}
          </p>
        ) : displayedCustomers.length === 0 ? (
          <p
            style={{
              color: "var(--text-desc)",
              gridColumn: "1 / -1",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            {t("noData")}
          </p>
        ) : (
          displayedCustomers.map((customer, index) => {
            const status = customer.status || "active";

            return (
              <div
                key={customer.id}
                className="user-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="user-card-menu">
                  <button
                    className="user-menu-btn"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === customer.id ? null : customer.id
                      )
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === customer.id && (
                    <div className="user-menu-dropdown">
                      {status === "locked" ? (
                        <button
                          type="button"
                          className="menu-unlock-btn"
                          onClick={() => handleUnlock(customer.id)}
                          disabled={processingId === customer.id}
                        >
                          <UnlockKeyhole size={15} />
                          {t("unlockAccount")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="menu-lock-btn"
                          onClick={() => handleLock(customer.id)}
                          disabled={processingId === customer.id}
                        >
                          <LockKeyhole size={15} />
                          {t("lockAccount")}
                        </button>
                      )}

                      <button
                        type="button"
                        className="menu-delete-btn"
                        onClick={() => handleDelete(customer.id)}
                        disabled={processingId === customer.id}
                      >
                        <Trash2 size={15} />
                        {t("deleteAccount")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="user-avatar">
                  {getInitials(customer.full_name)}
                </div>

                <div className="user-name">
                  {customer.full_name || t("unknownCustomer")}
                </div>

                <div
                  className="user-role-badge"
                  style={{ background: "#0ea5e920" }}
                >
                  {t("customerRole")}
                </div>

                <div className="user-info-list">
                  <div className="user-info-item">
                    <Mail size={14} color="var(--cyan-main)" />
                    {customer.email || t("noEmail")}
                  </div>

                  <div className="user-info-item">
                    <Phone size={14} color="var(--cyan-main)" />
                    {customer.phone || t("noPhone")}
                  </div>

                  <div className="user-info-item">
                    <Clock3 size={14} color="var(--cyan-main)" />
                    {formatDateTime(customer.created_at)}
                  </div>
                </div>

                {status === "locked" ? (
                  <div className="locked-chain-x">
                    <div className="chain chain-left"></div>
                    <div className="chain chain-right"></div>
                    <div className="lock-center">🔒</div>
                  </div>
                ) : (
                  <span className="status-badge-inline success">
                    {t("activeCustomer")}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}