import React, { useEffect, useState } from "react";
import { FiPlus, FiUsers, FiTrash2 } from "react-icons/fi";
import AppLayout from "../../components/layout/AppLayout";
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from "../../services/beneficiaryService";

import "./Beneficiaries.css";

const Beneficiaries = () => {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    beneficiaryName: "",
    beneficiaryAccountNumber: "",
    bankName: "",
    nickname: "",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");

  const load = () => {
    getBeneficiaries()
      .then((res) => setList(res.data || []))
      .catch(() => {
        setMsg("Could not load beneficiaries yet.");
        setMsgType("error");
      });
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await addBeneficiary(form);
      setForm({ beneficiaryName: "", beneficiaryAccountNumber: "", bankName: "", nickname: "" });
      setShowForm(false);
      setMsg("Beneficiary added.");
      setMsgType("info");
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not add beneficiary. Please check the details.");
      setMsgType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBeneficiary(id);
      load();
    } catch {
      setMsg("Could not delete beneficiary.");
      setMsgType("error");
    }
  };

  return (
    <AppLayout>
      <div className="page-header row">
        <div>
          <h1>Beneficiaries</h1>
          <p className="welcome-sub">Manage people you send money to regularly.</p>
        </div>
        <button className="btn-primary btn-inline" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> {showForm ? "Close" : "Add Beneficiary"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleAdd} className="inline-form">
            <input
              type="text"
              name="beneficiaryName"
              placeholder="Full name"
              value={form.beneficiaryName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="beneficiaryAccountNumber"
              placeholder="Account number"
              value={form.beneficiaryAccountNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="bankName"
              placeholder="Bank name"
              value={form.bankName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="nickname"
              placeholder="Nickname (optional)"
              value={form.nickname}
              onChange={handleChange}
            />
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      )}

      {msg && <div className={msgType === "error" ? "error-banner" : "info-banner"}>{msg}</div>}

      {list.length === 0 ? (
        <div className="empty-state">
          <FiUsers style={{ fontSize: "28px", opacity: 0.4 }} />
          <p>No beneficiaries added yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {list.map((b) => (
            <div className="stat-card" key={b.id}>
              <div className="stat-label"><FiUsers /> {b.nickname || b.beneficiaryName}</div>
              <div className="account-number">
                {b.bankName} •••• {b.beneficiaryAccountNumber?.slice(-4)}
              </div>
              <button className="btn-logout beneficiary-remove-btn" onClick={() => handleDelete(b.id)}>
                <FiTrash2 /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Beneficiaries;