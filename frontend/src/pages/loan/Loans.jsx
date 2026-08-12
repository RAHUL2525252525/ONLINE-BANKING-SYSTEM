import React, { useEffect, useState } from "react";
import { FiPlus, FiFileText } from "react-icons/fi";
import AppLayout from "../../components/layout/AppLayout";
import { getLoans, applyForLoan } from "../../services/loanService";
import { getAccounts } from "../../services/accountService";

import "./Loans.css";

const LOAN_TYPES = ["PERSONAL", "HOME", "CAR", "EDUCATION", "BUSINESS"];

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    loanType: "PERSONAL",
    amount: "",
    tenureMonths: "",
    accountNumber: "",
    purpose: "",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");

  useEffect(() => {
    getLoans()
      .then((res) => setLoans(res.data || []))
      .catch(() => {
        setMsg("Could not load loans yet — backend not connected.");
        setMsgType("error");
      });

    getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      await applyForLoan({
        ...form,
        amount: parseFloat(form.amount),
        tenureMonths: parseInt(form.tenureMonths, 10),
      });
      setMsg("Loan application submitted.");
      setMsgType("info");
      setShowForm(false);
      setForm({ loanType: "PERSONAL", amount: "", tenureMonths: "", accountNumber: "", purpose: "" });
      const res = await getLoans();
      setLoans(res.data || []);
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not submit loan application. Please try again.");
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header row">
        <div>
          <h1>Loans</h1>
          <p className="welcome-sub">Track active loans or apply for a new one.</p>
        </div>
        <button className="btn-primary btn-inline" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> {showForm ? "Close" : "Apply for Loan"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          {accounts.length === 0 ? (
            <div className="info-banner">
              You need at least one account before applying for a loan. Create one on the Accounts page first.
            </div>
          ) : (
            <form onSubmit={handleApply} className="inline-form">
              <select name="loanType" value={form.loanType} onChange={handleChange} required>
                {LOAN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <select name="accountNumber" value={form.accountNumber} onChange={handleChange} required>
                <option value="" disabled>Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountType} •••• {acc.accountNumber?.slice(-4)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Loan amount (min 1000)"
                min="1000"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="tenureMonths"
                placeholder="Tenure in months (3–360)"
                min="3"
                max="360"
                value={form.tenureMonths}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="purpose"
                placeholder="Purpose"
                value={form.purpose}
                onChange={handleChange}
              />
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Apply"}
              </button>
            </form>
          )}
        </div>
      )}

      {msg && <div className={msgType === "error" ? "error-banner" : "info-banner"}>{msg}</div>}

      {loans.length === 0 ? (
        <div className="empty-state">
          <FiFileText style={{ fontSize: "28px", opacity: 0.4 }} />
          <p>No loans yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {loans.map((l) => (
            <div className="stat-card" key={l.id}>
              <div className="stat-label"><FiFileText /> {l.purpose || l.loanType}</div>
              <div className="stat-value">₹{l.amount?.toFixed(2)}</div>
              <div className="account-number">{l.tenureMonths} months • {l.status}</div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Loans;