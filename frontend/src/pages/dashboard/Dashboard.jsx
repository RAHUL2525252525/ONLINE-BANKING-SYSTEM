import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiEye,
  FiEyeOff,
  FiSend,
  FiPlusCircle,
  FiFileText,
  FiUsers,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import { getAccounts } from "../../services/accountService";
import { getTransactionHistory } from "../../services/transactionService";

import "./Dashboard.css";

const isCredit = (type) => type === "DEPOSIT" || type === "TRANSFER_IN";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTx, setRecentTx] = useState([]);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | BankSphere";
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const accountsRes = await getAccounts();
        const accounts = accountsRes.data || [];

        setTotalBalance(
          accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
        );

        const histories = await Promise.all(
          accounts.map((acc) =>
            getTransactionHistory(acc.accountNumber)
              .then((res) => res.data || [])
              .catch(() => [])
          )
        );

        const allTx = histories.flat();
        allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentTx(allTx.slice(0, 5));
      } catch {
        // Keep defaults
      }

      setLoading(false);
    };

    load();
  }, []);

  const quickActions = [
    { icon: <FiSend />, label: "Send Money", color: "action-blue", onClick: () => navigate("/transactions") },
    { icon: <FiPlusCircle />, label: "Add Money", color: "action-green", onClick: () => navigate("/accounts") },
    { icon: <FiFileText />, label: "Apply Loan", color: "action-orange", onClick: () => navigate("/loans") },
    { icon: <FiUsers />, label: "Beneficiary", color: "action-purple", onClick: () => navigate("/beneficiaries") },
    { icon: <FiUser />, label: "Profile", color: "action-pink", onClick: () => navigate("/profile") },
  ];

  return (
    <AppLayout>
      <div className="bank-dashboard">
        <div className="dashboard-column">
          <div className="dashboard-topbar">
            <div className="welcome-small">Welcome back,</div>
            <h1>
              {user?.fullName || "User"} <span>👋</span>
            </h1>
          </div>

          <div className="dashboard-top-row">
            <div className="balance-card">
              <div className="balance-header">
                <span>Total Balance</span>
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setBalanceHidden((v) => !v)}
                  aria-label="Toggle balance visibility"
                >
                  {balanceHidden ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="balance-value">
                {balanceHidden ? "••••••" : `₹${totalBalance.toFixed(2)}`}
              </div>

              <div className="available-label">Available Balance</div>

              <div className="available-value">
                {balanceHidden ? "••••••" : `₹${totalBalance.toFixed(2)}`}
              </div>

              <div className="bank-watermark">🏛</div>
            </div>

            <div className="quick-actions-card">
              <div className="quick-actions-heading">Quick Actions</div>

              <div className="quick-actions-grid">
                {quickActions.map((action) => (
                  <button
                    type="button"
                    key={action.label}
                    className="quick-action-tile"
                    onClick={action.onClick}
                  >
                    <div className={`action-circle ${action.color}`}>
                      {action.icon}
                    </div>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card transactions-card">
            <div className="card-heading">
              <h2>Recent Transactions</h2>
              <button type="button" onClick={() => navigate("/transactions")}>
                View All
              </button>
            </div>

            {!loading && recentTx.length === 0 ? (
              <div className="empty-state">
                <FiArrowUpRight />
                <p>No transactions yet.</p>
              </div>
            ) : (
              <div className="transactions-list">
                {recentTx.map((tx) => {
                  const credit = isCredit(tx.type);
                  return (
                    <div className="transaction-row" key={tx.id}>
                      <div className={`transaction-icon ${credit ? "credit" : "debit"}`}>
                        {credit ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </div>

                      <div className="transaction-info">
                        <strong>{tx.description || "Transaction"}</strong>
                        <span>{tx.date}</span>
                      </div>

                      <div className={`transaction-amount ${credit ? "credit" : "debit"}`}>
                        {credit ? "+" : "-"}₹{tx.amount?.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;