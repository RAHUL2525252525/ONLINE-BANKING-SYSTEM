import React, { useEffect, useState } from "react";
import { FiPlus, FiCreditCard, FiX } from "react-icons/fi";
import AppLayout from "../../components/layout/AppLayout";
import { getAccounts, createAccount } from "../../services/accountService";
import { depositFunds } from "../../services/transactionService";

import "./Accounts.css";

const ALL_TYPES = ["SAVINGS", "CURRENT"];

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState({
    accountType: "",
    aadharNumber: "",
    panNumber: "",
    dateOfBirth: "",
    nomineeName: "",
    nomineeRelation: "",
  });

  const [depositAccount, setDepositAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [depositing, setDepositing] = useState(false);
  const [depositError, setDepositError] = useState("");

  const loadAccounts = () => {
    setLoading(true);
    getAccounts()
      .then((res) => setAccounts(res.data || []))
      .catch(() => setError("Could not load accounts yet — backend not connected."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const ownedTypes = accounts.map((a) => a.accountType);
  const availableTypes = ALL_TYPES.filter((t) => !ownedTypes.includes(t));
  const isFirstAccount = accounts.length === 0;

  const openModal = () => {
    setForm({
      accountType: availableTypes[0] || "",
      aadharNumber: "",
      panNumber: "",
      dateOfBirth: "",
      nomineeName: "",
      nomineeRelation: "",
    });
    setCreateError("");
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      await createAccount(form);
      setShowModal(false);
      loadAccounts();
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Could not create account. Please try again."
      );
    } finally {
      setCreating(false);
    }
  };

  const openDepositModal = (acc) => {
    setDepositAccount(acc);
    setDepositAmount("");
    setDepositNote("");
    setDepositError("");
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setDepositing(true);
    setDepositError("");

    try {
      await depositFunds({
        accountNumber: depositAccount.accountNumber,
        amount: parseFloat(depositAmount),
        description: depositNote,
      });
      setDepositAccount(null);
      loadAccounts();
    } catch (err) {
      setDepositError(err.response?.data?.message || "Could not add money. Please try again.");
    } finally {
      setDepositing(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header row">
        <div>
          <h1>Your Accounts</h1>
          <p className="welcome-sub">Manage and view all your linked bank accounts.</p>
        </div>
        {availableTypes.length > 0 ? (
          <button className="btn-primary btn-inline" onClick={openModal}>
            <FiPlus /> New Account
          </button>
        ) : (
          <button className="btn-primary btn-inline" disabled title="You already have one of each account type">
            <FiPlus /> All account types created
          </button>
        )}
      </div>

      {error && <div className="info-banner">{error}</div>}

      {!loading && accounts.length === 0 && !error && (
        <div className="empty-state">
          <FiCreditCard style={{ fontSize: "28px", opacity: 0.4 }} />
          <p>No accounts found. Create your first account to get started.</p>
        </div>
      )}

      <div className="card-grid">
        {accounts.map((acc) => (
          <div className="stat-card account-card" key={acc.id}>
            <div className="stat-label"><FiCreditCard /> {acc.accountType || "Account"}</div>
            <div className="stat-value">₹{acc.balance?.toFixed(2) || "0.00"}</div>
            <div className="account-number">•••• {acc.accountNumber?.slice(-4) || "0000"}</div>
            <button
              className="btn-primary btn-inline"
              style={{ marginTop: "16px" }}
              onClick={() => openDepositModal(acc)}
            >
              <FiPlus /> Add Money
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Open a new account</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            {createError && <div className="error-banner">{createError}</div>}

            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label htmlFor="accountType">Account type</label>
                <select id="accountType" name="accountType" value={form.accountType} onChange={handleChange}>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {isFirstAccount && (
                <>
                  <div className="info-banner" style={{ marginBottom: "18px" }}>
                    Since this is your first account, we need a few KYC details. You won't be asked again.
                  </div>

                  <div className="form-group">
                    <label htmlFor="aadharNumber">Aadhar number</label>
                    <input
                      id="aadharNumber"
                      type="text"
                      name="aadharNumber"
                      placeholder="12-digit Aadhar number"
                      value={form.aadharNumber}
                      onChange={handleChange}
                      maxLength={12}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="panNumber">PAN number</label>
                    <input
                      id="panNumber"
                      type="text"
                      name="panNumber"
                      placeholder="e.g. ABCDE1234F"
                      value={form.panNumber}
                      onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nomineeName">Nominee name</label>
                    <input
                      id="nomineeName"
                      type="text"
                      name="nomineeName"
                      placeholder="Full name of nominee"
                      value={form.nomineeName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nomineeRelation">Relation to nominee</label>
                    <input
                      id="nomineeRelation"
                      type="text"
                      name="nomineeRelation"
                      placeholder="e.g. Father, Spouse, Sibling"
                      value={form.nomineeRelation}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {depositAccount && (
        <div className="modal-overlay" onClick={() => setDepositAccount(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add money — •••• {depositAccount.accountNumber.slice(-4)}</h2>
              <button className="modal-close" onClick={() => setDepositAccount(null)}>
                <FiX />
              </button>
            </div>

            {depositError && <div className="error-banner">{depositError}</div>}

            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label htmlFor="depositAmount">Amount</label>
                <input
                  id="depositAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="depositNote">Note (optional)</label>
                <input
                  id="depositNote"
                  type="text"
                  placeholder="e.g. Salary, Cash deposit"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setDepositAccount(null)} disabled={depositing}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={depositing}>
                  {depositing ? "Adding..." : "Add Money"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Accounts;