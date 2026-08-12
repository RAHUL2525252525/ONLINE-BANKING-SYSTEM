import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiShield, FiCreditCard, FiCopy, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import { getAccounts } from "../../services/accountService";

import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() => {});
  }, []);

  const handleCopy = (accountNumber, id) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Profile</h1>
        <p className="welcome-sub">Your account information.</p>
      </div>

      <div className="form-card profile-card">
        <div className="profile-row"><FiUser /> <span>{user?.fullName || "—"}</span></div>
        <div className="profile-row"><FiMail /> <span>{user?.email || "—"}</span></div>
        <div className="profile-row"><FiPhone /> <span>{user?.phoneNumber || "—"}</span></div>
        <div className="profile-row"><FiShield /> <span>{user?.role || "USER"}</span></div>
      </div>

      <div className="section-block">
        <div className="section-header">
          <h2>Your Accounts</h2>
        </div>

        {accounts.length === 0 ? (
          <div className="empty-state">
            <FiCreditCard style={{ fontSize: "28px", opacity: 0.4 }} />
            <p>No accounts yet.</p>
          </div>
        ) : (
          <div className="form-card profile-card" style={{ padding: 0 }}>
            {accounts.map((acc) => (
              <div className="profile-row profile-account-row" key={acc.id}>
                <div className="profile-account-left">
                  <FiCreditCard />
                  <div>
                    <div className="profile-account-type">{acc.accountType}</div>
                    <div className="profile-account-meta">
                      {acc.accountNumber} • ₹{acc.balance?.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => handleCopy(acc.accountNumber, acc.id)}
                  title="Copy account number"
                >
                  {copiedId === acc.id ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;