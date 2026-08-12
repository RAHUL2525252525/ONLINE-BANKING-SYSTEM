import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome, FiCreditCard, FiRepeat, FiUsers,
  FiFileText, FiUser, FiLogOut, FiMenu, FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initial = (user?.fullName || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const links = [
    { to: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/accounts", icon: <FiCreditCard />, label: "Accounts" },
    { to: "/transactions", icon: <FiRepeat />, label: "Transactions" },
    { to: "/beneficiaries", icon: <FiUsers />, label: "Beneficiaries" },
    { to: "/loans", icon: <FiFileText />, label: "Loans" },
    { to: "/profile", icon: <FiUser />, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="sidebar-mobile-bar">
        <div className="sidebar-mobile-brand">
          <div className="icon">🏦</div>
          <span>NovaBank</span>
        </div>
        <button
          className="sidebar-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Overlay for mobile drawer */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobile}></div>
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="icon">🏦</div>
          <span>BankSphere</span>
          <button
            className="sidebar-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initial}</div>
            <div className="sidebar-user-info">
              <div className="name">{user?.fullName || "User"}</div>
              <div className="email">{user?.email}</div>
            </div>
          </div>
          <button className="btn-logout full-width" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;