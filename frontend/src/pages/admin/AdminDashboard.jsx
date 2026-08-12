import "./admin.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiCreditCard,
  FiActivity,
  FiShield,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiEye,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {
  getAllUsers,
  deleteUser,
  lockUser,
  unlockUser,
  getAllAccounts,
  deleteAccount,
  getAllLoans,
} from "../../services/adminService";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pendingLoanCount, setPendingLoanCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);

    getAllUsers()
      .then((res) => setUsers(res.data || []))
      .catch(() =>
        setError("Could not load users — check backend connection.")
      )
      .finally(() => setLoading(false));
  };

  const loadAccounts = () => {
    getAllAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() =>
        setError("Could not load accounts — check backend connection.")
      );
  };

  const loadPendingLoans = () => {
    getAllLoans()
      .then((res) => {
        const loans = res.data || [];

        setPendingLoanCount(
          loans.filter((loan) => loan.status === "PENDING").length
        );
      })
      .catch(() => {
        // Leave at 0 if this fails.
        // The Loans page will surface the actual error.
      });
  };

  useEffect(() => {
    loadUsers();
    loadAccounts();
    loadPendingLoans();
  }, []);

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Delete user "${name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );
    } catch {
      setError("Failed to delete user.");
    }
  };

  const handleToggleLock = async (u) => {
    try {
      const res = u.accountNonLocked
        ? await lockUser(u.id)
        : await unlockUser(u.id);

      setUsers((prev) =>
        prev.map((usr) =>
          usr.id === u.id ? res.data : usr
        )
      );
    } catch {
      setError("Failed to update lock status.");
    }
  };

  const handleDeleteAccount = async (
    id,
    accountNumber
  ) => {
    if (
      !window.confirm(
        `Delete account •••• ${accountNumber.slice(
          -4
        )}? This will also remove its transactions and loans. This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteAccount(id);

      setAccounts((prev) =>
        prev.filter((a) => a.id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete account."
      );
    }
  };

  return (
    <div className="dashboard-shell">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">

        <div className="brand">
          <div className="icon">🏦</div>

          <span>BankSphere</span>

          <span className="admin-badge">
            ADMIN
          </span>
        </div>

        <div className="user-chip">

          <button
            className="btn-logout"
            onClick={() =>
              navigate("/admin/loans")
            }
          >
            Loan Applications
          </button>

          <div className="admin-avatar">
            A
          </div>

          <button
            className="btn-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= DASHBOARD CONTENT ================= */}
      <div className="dashboard-content">

        <h1>Admin Control Panel</h1>

        <p className="welcome-sub">
          Logged in as{" "}
          <strong>{user?.email}</strong> — manage
          users, accounts, and system activity.
        </p>

        {/* ================= STATISTICS ================= */}
        <div className="card-grid">

          <div className="stat-card">
            <div className="stat-label">
              <FiUsers />
              Total Users
            </div>

            <div className="stat-value">
              {users.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <FiCreditCard />
              Total Accounts
            </div>

            <div className="stat-value">
              {accounts.length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <FiActivity />
              Transactions Today
            </div>

            <div className="stat-value">
              0
            </div>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/admin/loans")
            }
          >
            <div className="stat-label">
              <FiShield />
              Pending Approvals
            </div>

            <div className="stat-value">
              {pendingLoanCount}
            </div>
          </div>

        </div>

        {/* ================= ERROR MESSAGE ================= */}
        {error && (
          <div className="info-banner">
            {error}
          </div>
        )}

        {/* ================= USERS LIST ================= */}
        <div className="section-block">

          <div className="section-header">
            <h2>
              All Users ({users.length})
            </h2>
          </div>

          {loading ? (
            <p className="welcome-sub">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <FiUsers
                style={{
                  fontSize: "28px",
                  opacity: 0.4,
                }}
              />

              <p>No users found.</p>
            </div>
          ) : (
            <div className="admin-list-container">

              {users.map((u) => (
                <div
                  className="admin-list-item"
                  key={u.id}
                >

                  <div className="item-main-info">

                    <div className="item-title">

                      <strong>
                        {u.fullName}
                      </strong>

                      <span
                        className={`status-pill ${
                          u.accountNonLocked
                            ? "active"
                            : "locked"
                        }`}
                      >
                        {u.accountNonLocked
                          ? "Active"
                          : "Locked"}
                      </span>

                    </div>

                    <div className="item-sub-details">

                      <span>
                        <FiMail />
                        {u.email}
                      </span>

                      <span>
                        <FiPhone />
                        {u.phoneNumber ||
                          "N/A"}
                      </span>

                      <span className="role-tag">
                        {(u.roles || [])
                          .join(", ")
                          .replace(
                            /ROLE_/g,
                            ""
                          )}
                      </span>

                    </div>

                  </div>

                  <div className="row-actions">

                    <button
                      className="icon-btn"
                      onClick={() =>
                        navigate(
                          `/admin/users/${u.id}`
                        )
                      }
                      title="View full details"
                    >
                      <FiEye />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleToggleLock(u)
                      }
                      title={
                        u.accountNonLocked
                          ? "Lock account"
                          : "Unlock account"
                      }
                    >
                      {u.accountNonLocked ? (
                        <FiLock />
                      ) : (
                        <FiUnlock />
                      )}
                    </button>

                    <button
                      className="icon-btn danger"
                      onClick={() =>
                        handleDelete(
                          u.id,
                          u.fullName
                        )
                      }
                      title="Delete user"
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* ================= ACCOUNTS LIST ================= */}
        <div className="section-block">

          <div className="section-header">
            <h2>
              All Accounts ({accounts.length})
            </h2>
          </div>

          {accounts.length === 0 ? (
            <div className="empty-state">

              <FiCreditCard
                style={{
                  fontSize: "28px",
                  opacity: 0.4,
                }}
              />

              <p>No accounts found.</p>

            </div>
          ) : (
            <div className="admin-list-container">

              {accounts.map((a) => (
                <div
                  className="admin-list-item"
                  key={a.id}
                >

                  <div className="item-main-info">

                    <div className="item-title">

                      <strong>
                        {a.ownerName}
                      </strong>

                      <span className="acc-number-badge">
                        {a.accountNumber}
                      </span>

                      <span
                        className={`status-pill ${
                          a.status === "ACTIVE"
                            ? "active"
                            : "locked"
                        }`}
                      >
                        {a.status}
                      </span>

                    </div>

                    <div className="item-sub-details">

                      <span>
                        <FiMail />
                        {a.ownerEmail}
                      </span>

                      <span className="type-badge">
                        {a.accountType}
                      </span>

                    </div>

                  </div>

                  <div className="item-balance-group">

                    <div className="balance-amount">
                      ₹
                      {a.balance?.toFixed(2)}
                    </div>

                    <div className="row-actions">

                      <button
                        className="icon-btn danger"
                        onClick={() =>
                          handleDeleteAccount(
                            a.id,
                            a.accountNumber
                          )
                        }
                        title="Delete account"
                      >
                        <FiTrash2 />
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
