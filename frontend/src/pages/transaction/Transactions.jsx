import React, { useEffect, useState } from "react";
import { FiSend, FiRepeat, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import AppLayout from "../../components/layout/AppLayout";
import { getTransactionHistory, transferFunds } from "../../services/transactionService";
import { getAccounts } from "../../services/accountService";

import "./Transactions.css";

const isCredit = (type) => type === "DEPOSIT" || type === "TRANSFER_IN";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fromAccountNumber: "", toAccountNumber: "", amount: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    getAccounts()
      .then((res) => {
        const accs = res.data || [];
        setAccounts(accs);
        if (accs.length > 0) {
          setSelectedAccount(accs[0].accountNumber);
          setForm((f) => ({ ...f, fromAccountNumber: accs[0].accountNumber }));
        }
      })
      .catch(() => setError("Could not load your accounts."));
  }, []);

  useEffect(() => {
    if (!selectedAccount) return;
    getTransactionHistory(selectedAccount)
      .then((res) => setTransactions(res.data || []))
      .catch(() => setError("Could not load transactions yet."));
  }, [selectedAccount]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTransfer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg("");
    try {
      await transferFunds({ ...form, amount: parseFloat(form.amount) });
      setFormMsg("Transfer submitted successfully.");
      setForm({ fromAccountNumber: selectedAccount, toAccountNumber: "", amount: "", description: "" });
      const res = await getTransactionHistory(selectedAccount);
      setTransactions(res.data || []);
    } catch (err) {
      setFormMsg(err.response?.data?.message || "Transfer failed. Please check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header row">
        <div>
          <h1>Transactions</h1>
          <p className="welcome-sub">View history and send money to other accounts.</p>
        </div>
        <button className="btn-primary btn-inline" onClick={() => setShowForm(!showForm)}>
          <FiSend /> {showForm ? "Close" : "New Transfer"}
        </button>
      </div>

      {accounts.length > 1 && (
        <div className="form-group tx-account-selector">
          <label>Viewing account</label>
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.accountNumber}>
                {acc.accountType} •••• {acc.accountNumber?.slice(-4)}
              </option>
            ))}
          </select>
        </div>
      )}

      {showForm && (
        <div className="form-card">
          {formMsg && <div className="info-banner">{formMsg}</div>}
          {accounts.length === 0 ? (
            <div className="info-banner">You need an account before you can transfer funds.</div>
          ) : (
            <form onSubmit={handleTransfer} className="inline-form">
              <select name="fromAccountNumber" value={form.fromAccountNumber} onChange={handleChange} required>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    From: {acc.accountType} •••• {acc.accountNumber?.slice(-4)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="toAccountNumber"
                placeholder="Recipient account number"
                value={form.toAccountNumber}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Note (optional)"
                value={form.description}
                onChange={handleChange}
              />
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send"}
              </button>
            </form>
          )}
        </div>
      )}

      {error && <div className="info-banner">{error}</div>}

      <div className="section-block">
        <div className="section-header">
          <h2>History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <FiRepeat style={{ fontSize: "28px", opacity: 0.4 }} />
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div className="tx-list">
            {transactions.map((tx) => (
              <div className="tx-row" key={tx.id}>
                <div className={`tx-icon ${isCredit(tx.type) ? "credit" : "debit"}`}>
                  {isCredit(tx.type) ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                </div>
                <div className="tx-info">
                  <div className="tx-title">{tx.description || "Transaction"}</div>
                  <div className="tx-date">{tx.date}</div>
                </div>
                <div className={`tx-amount ${isCredit(tx.type) ? "credit" : "debit"}`}>
                  {isCredit(tx.type) ? "+" : "-"}₹{tx.amount?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Transactions;