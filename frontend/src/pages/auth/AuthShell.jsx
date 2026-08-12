import React from "react";
import { FiLock } from "react-icons/fi";
import "./auth.css";

const AuthShell = ({ children }) => {
  return (
    <div className="bs-app">

      {/* ================= NAVBAR ================= */}

      <header className="bs-navbar">

        <div className="bs-navbar-brand">
          <div className="bs-navbar-logo">
            BS
          </div>

          <span className="bs-navbar-name">
            BankSphere
          </span>
        </div>

        <div className="bs-navbar-right">

          <nav className="bs-navbar-links">
            <a href="#help">Help</a>
            <a href="#locate">Locate Branch</a>
          </nav>

          <div className="bs-secure-badge">
            <FiLock />
            <span>Secure connection</span>
          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="bs-main">
        {children}
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="bs-site-footer">

        <div className="bs-site-footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#security">Security</a>
          <a href="#terms">Terms</a>
        </div>

        <span className="bs-site-footer-copy">
          © 2026 BankSphere. All rights reserved.
        </span>

      </footer>

    </div>
  );
};

export default AuthShell;