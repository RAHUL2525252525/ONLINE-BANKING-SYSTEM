import "./admin.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCalendar,
  FiArrowUpRight,
  FiArrowDownLeft,
} from "react-icons/fi";
import { getUserDetails } from "../../services/adminService";

// Backend TransactionType enum values are DEPOSIT, WITHDRAW, TRANSFER_OUT, TRANSFER_IN
const isCredit = (type) => type === "DEPOSIT" || type === "TRANSFER_IN";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails(id)
      .then((res) => setDetails(res.data))
      .catch(() => setError("Could not load this user's details."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="dashboard-shell">
      <nav className="navbar">
        <div className="brand">
          <div className="icon">🏦</div>
          BankSphere <span className="admin-badge">ADMIN</span>
        </div>

        <button
          className="btn-logout"
          onClick={() => navigate("/admin")}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </nav>

      <div className="dashboard-content">
        {loading ? (
          <p className="welcome-sub">Loading user details...</p>
        ) : error ? (
          <div className="info-banner">{error}</div>
        ) : (
          <>
            {/* Profile */}
            <div className="section-block">
              <div className="section-header">
                <h2>Profile</h2>
              </div>

              <div className="form-card">
                <div className="profile-row">
                  <FiUser /> {details.fullName}
                </div>

                <div className="profile-row">
                  <FiMail /> {details.email}
                </div>

                <div className="profile-row">
                  <FiPhone /> {details.phoneNumber || "—"}
                </div>

                <div className="profile-row">
                  <FiCreditCard /> Aadhar: {details.aadharNumber || "—"}
                </div>

                <div className="profile-row">
                  <FiCreditCard /> PAN: {details.panNumber || "—"}
                </div>

                <div className="profile-row">
                  <FiCalendar /> DOB: {details.dateOfBirth || "—"}
                </div>

                <div className="profile-row">
                  Nominee: {details.nomineeName || "—"} (
                  {details.nomineeRelation || "—"})
                </div>

                <div className="profile-row">
                  Role: {(details.roles || [])
                    .join(", ")
                    .replace(/ROLE_/g, "")}
                </div>

                <div className="profile-row">
                  Status:{" "}
                  <span
                    className={`status-pill ${
                      details.accountNonLocked ? "active" : "locked"
                    }`}
                  >
                    {details.accountNonLocked ? "Active" : "Locked"}
                  </span>
                </div>
              </div>
            </div>

            {/* Accounts */}
            <div className="section-block">
              <div className="section-header">
                <h2>Accounts ({details.accounts?.length || 0})</h2>
              </div>

              {!details.accounts || details.accounts.length === 0 ? (
                <div className="empty-state">
                  <p>No accounts.</p>
                </div>
              ) : (
                <div className="user-table">
                  <div
                    className="user-table-header"
                    style={{
                      gridTemplateColumns: "1.6fr 1fr 1fr 0.8fr",
                    }}
                  >
                    <span>Account Number</span>
                    <span>Type</span>
                    <span>Balance</span>
                    <span>Status</span>
                  </div>

                  {details.accounts.map((a) => (
                    <div
                      className="user-table-row"
                      key={a.id}
                      style={{
                        gridTemplateColumns: "1.6fr 1fr 1fr 0.8fr",
                      }}
                    >
                      <span>{a.accountNumber}</span>
                      <span>{a.accountType}</span>
                      <span>₹{a.balance?.toFixed(2)}</span>

                      <span>
                        <span
                          className={`status-pill ${
                            a.status === "ACTIVE" ? "active" : "locked"
                          }`}
                        >
                          {a.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Loans */}
            <div className="section-block">
              <div className="section-header">
                <h2>Loans ({details.loans?.length || 0})</h2>
              </div>

              {!details.loans || details.loans.length === 0 ? (
                <div className="empty-state">
                  <p>No loan applications.</p>
                </div>
              ) : (
                <div className="user-table">
                  <div
                    className="user-table-header"
                    style={{
                      gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr 1fr",
                    }}
                  >
                    <span>Type</span>
                    <span>Amount</span>
                    <span>Tenure</span>
                    <span>Status</span>
                    <span>Applied</span>
                  </div>

                  {details.loans.map((l) => (
                    <div
                      className="user-table-row"
                      key={l.id}
                      style={{
                        gridTemplateColumns: "1fr 1fr 0.8fr 0.8fr 1fr",
                      }}
                    >
                      <span>{l.loanType}</span>
                      <span>₹{l.amount?.toFixed(2)}</span>
                      <span>{l.tenureMonths} mo</span>

                      <span>
                        <span
                          className={`status-pill ${
                            l.status === "APPROVED"
                              ? "active"
                              : l.status === "PENDING"
                              ? ""
                              : "locked"
                          }`}
                        >
                          {l.status}
                        </span>
                      </span>

                      <span>
                        {l.appliedAt
                          ? new Date(l.appliedAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Beneficiaries */}
            <div className="section-block">
              <div className="section-header">
                <h2>
                  Beneficiaries ({details.beneficiaries?.length || 0})
                </h2>
              </div>

              {!details.beneficiaries ||
              details.beneficiaries.length === 0 ? (
                <div className="empty-state">
                  <p>No beneficiaries added.</p>
                </div>
              ) : (
                <div className="user-table">
                  <div
                    className="user-table-header"
                    style={{
                      gridTemplateColumns: "1.2fr 1.4fr 1fr 1fr",
                    }}
                  >
                    <span>Name</span>
                    <span>Account Number</span>
                    <span>Bank</span>
                    <span>Nickname</span>
                  </div>

                  {details.beneficiaries.map((b) => (
                    <div
                      className="user-table-row"
                      key={b.id}
                      style={{
                        gridTemplateColumns: "1.2fr 1.4fr 1fr 1fr",
                      }}
                    >
                      <span>{b.beneficiaryName}</span>
                      <span>{b.beneficiaryAccountNumber}</span>
                      <span>{b.bankName || "—"}</span>
                      <span>{b.nickname || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transactions */}
            <div className="section-block">
              <div className="section-header">
                <h2>
                  Transactions ({details.transactions?.length || 0})
                </h2>
              </div>

              {!details.transactions ||
              details.transactions.length === 0 ? (
                <div className="empty-state">
                  <p>No transactions yet.</p>
                </div>
              ) : (
                <div className="tx-list">
                  {details.transactions.map((tx) => (
                    <div className="tx-row" key={tx.id}>
                      <div
                        className={`tx-icon ${
                          isCredit(tx.type) ? "credit" : "debit"
                        }`}
                      >
                        {isCredit(tx.type) ? (
                          <FiArrowDownLeft />
                        ) : (
                          <FiArrowUpRight />
                        )}
                      </div>

                      <div className="tx-info">
                        <div className="tx-title">
                          {tx.description || "Transaction"} —{" "}
                          {tx.accountNumber}
                        </div>

                        <div className="tx-date">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </div>

                      <div
                        className={`tx-amount ${
                          isCredit(tx.type) ? "credit" : "debit"
                        }`}
                      >
                        {isCredit(tx.type) ? "+" : "-"}₹
                        {tx.amount?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
