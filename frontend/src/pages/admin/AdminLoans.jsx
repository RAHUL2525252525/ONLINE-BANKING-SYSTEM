import "./admin.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiFileText } from "react-icons/fi";
import { getAllLoans, approveLoan, rejectLoan } from "../../services/adminService";

const AdminLoans = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState(null);

  const loadLoans = () => {
    setLoading(true);
    getAllLoans()
      .then((res) => setLoans(res.data || []))
      .catch(() => setError("Could not load loan applications — check backend connection."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this loan? The amount will be credited to the applicant's account.")) return;
    setActingOn(id);
    try {
      const res = await approveLoan(id);
      setLoans((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve loan.");
    } finally {
      setActingOn(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):", "");
    if (reason === null) return; // user cancelled
    setActingOn(id);
    try {
      const res = await rejectLoan(id, reason);
      setLoans((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject loan.");
    } finally {
      setActingOn(null);
    }
  };

  const pendingCount = loans.filter((l) => l.status === "PENDING").length;

  return (
    <div className="dashboard-shell">
      <nav className="navbar">
        <div className="brand">
          <div className="icon">🏦</div>
          BankSphere <span className="admin-badge">ADMIN</span>
        </div>
        <button className="btn-logout" onClick={() => navigate("/admin")}>
          <FiArrowLeft /> Back to Dashboard
        </button>
      </nav>

      <div className="dashboard-content">
        <h1>Loan Applications</h1>
        <p className="welcome-sub">
          {pendingCount} pending application{pendingCount === 1 ? "" : "s"} awaiting a decision.
        </p>

        {error && <div className="info-banner">{error}</div>}

        <div className="section-block">
          {loading ? (
            <p className="welcome-sub">Loading loan applications...</p>
          ) : loans.length === 0 ? (
            <div className="empty-state">
              <FiFileText style={{ fontSize: "28px", opacity: 0.4 }} />
              <p>No loan applications yet.</p>
            </div>
          ) : (
            <div className="user-table">
              <div
                className="user-table-header"
                style={{ gridTemplateColumns: "1.4fr 0.9fr 1fr 0.7fr 0.8fr 1fr 1fr" }}
              >
                <span>Applicant</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Tenure</span>
                <span>Status</span>
                <span>Applied</span>
                <span>Actions</span>
              </div>
              {loans.map((l) => (
                <div
                  className="user-table-row"
                  key={l.id}
                  style={{ gridTemplateColumns: "1.4fr 0.9fr 1fr 0.7fr 0.8fr 1fr 1fr" }}
                >
                  <span>{l.applicantEmail}</span>
                  <span>{l.loanType}</span>
                  <span>₹{l.amount?.toFixed(2)}</span>
                  <span>{l.tenureMonths} mo</span>
                  <span>
                    <span
                      className={`status-pill ${l.status === "APPROVED" ? "active" : l.status === "PENDING" ? "" : "locked"}`}
                    >
                      {l.status}
                    </span>
                  </span>
                  <span>{l.appliedAt ? new Date(l.appliedAt).toLocaleDateString() : "—"}</span>
                  <span className="row-actions">
                    {l.status === "PENDING" ? (
                      <>
                        <button
                          className="icon-btn"
                          onClick={() => handleApprove(l.id)}
                          disabled={actingOn === l.id}
                          title="Approve loan"
                        >
                          <FiCheckCircle />
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleReject(l.id)}
                          disabled={actingOn === l.id}
                          title="Reject loan"
                        >
                          <FiXCircle />
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {l.status === "REJECTED" ? l.rejectionReason || "Decided" : "Decided"}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoans;