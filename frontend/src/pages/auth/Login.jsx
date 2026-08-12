import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiShield,
  FiTrendingUp,
  FiSmartphone,
} from "react-icons/fi";

import {
  loginUser,
  forgotPassword,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import AuthShell from "./AuthShell";
import "./auth.css";


const Login = () => {

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [forgotError, setForgotError] = useState("");

  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const res = await loginUser(formData);

      login(
        res.data.user,
        res.data.token
      );

      const roles =
        res.data.user.roles || [];

      if (
        roles.includes("ROLE_ADMIN")
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed. Check your credentials."
      );

    } finally {

      setLoading(false);

    }
  };


  const openForgot = (e) => {

    e.preventDefault();

    setForgotEmail(
      formData.email || ""
    );

    setForgotError("");

    setMode("forgot");
  };


  const backToLogin = () => {

    setError("");

    setMode("login");
  };


  const handleForgotSubmit = async (e) => {

    e.preventDefault();

    setForgotError("");

    setForgotLoading(true);

    try {

      await forgotPassword(
        forgotEmail
      );

      setMode("sent");

    } catch (err) {

      setForgotError(
        err.response?.data?.message ||
        "Could not send reset link. Please check the email and try again."
      );

    } finally {

      setForgotLoading(false);

    }
  };


  /* =====================================================
     LEFT BRAND PANEL
     ===================================================== */

  const brandPanel = (

    <section className="bs-brand-panel">

      <div className="bs-brand-glow"></div>

      <div className="bs-brand-content">

        <div className="bs-brand-tag">
          DIGITAL BANKING • 01
        </div>

        <h1>
          Banking,
          <br />
          without
          <br />
          boundaries.
        </h1>

        <p>
          BankSphere brings your money, payments,
          transfers and financial activity together
          in one secure digital experience.
        </p>

        <div className="bs-brand-features">

          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiShield />
            </div>

            <strong>
              Secure
            </strong>

            <span>
              Bank-grade protection
              for every session.
            </span>

          </div>


          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiTrendingUp />
            </div>

            <strong>
              Smarter
            </strong>

            <span>
              Real-time visibility
              into your finances.
            </span>

          </div>


          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiSmartphone />
            </div>

            <strong>
              Anywhere
            </strong>

            <span>
              Your banking experience
              across every device.
            </span>

          </div>

        </div>

      </div>

    </section>
  );


  /* =====================================================
     SENT
     ===================================================== */

  if (mode === "sent") {

    return (

      <AuthShell>

        <div className="bs-split">

          {brandPanel}

          <section className="bs-form-panel">

            <div className="bs-card">

              <div className="bs-success-icon">
                ✓
              </div>

              <h2>
                Check your email
              </h2>

              <p className="bs-subtitle">
                If an account exists for{" "}
                <strong>
                  {forgotEmail}
                </strong>
                , we've sent a password
                reset link to it.
              </p>

              <button
                className="bs-btn-primary"
                onClick={backToLogin}
              >
                <FiArrowLeft />
                Back to login
              </button>

            </div>

          </section>

        </div>

      </AuthShell>
    );
  }


  /* =====================================================
     FORGOT PASSWORD
     ===================================================== */

  if (mode === "forgot") {

    return (

      <AuthShell>

        <div className="bs-split">

          {brandPanel}

          <section className="bs-form-panel">

            <div className="bs-card">

              <h2>
                Forgot your password?
              </h2>

              <p className="bs-subtitle">
                Enter the email linked to your
                account and we'll send you a
                secure reset link.
              </p>


              {forgotError && (
                <div className="bs-error">
                  {forgotError}
                </div>
              )}


              <form
                onSubmit={handleForgotSubmit}
              >

                <div className="bs-field">

                  <label
                    className="bs-label"
                    htmlFor="forgotEmail"
                  >
                    Email address
                  </label>

                  <div className="bs-input-wrap">

                    <FiMail
                      className="bs-field-icon"
                    />

                    <input
                      id="forgotEmail"
                      type="email"
                      name="forgotEmail"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) =>
                        setForgotEmail(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </div>


                <button
                  className="bs-btn-primary"
                  type="submit"
                  disabled={forgotLoading}
                >
                  {forgotLoading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

              </form>


              <p className="bs-footer-text">

                <button
                  type="button"
                  className="bs-link-btn"
                  onClick={backToLogin}
                >
                  <FiArrowLeft />
                  Back to login
                </button>

              </p>

            </div>

          </section>

        </div>

      </AuthShell>
    );
  }


  /* =====================================================
     LOGIN
     ===================================================== */

  return (

    <AuthShell>

      <div className="bs-split">

        {brandPanel}

        <section className="bs-form-panel">

          <div className="bs-card">

            <h2>
              Welcome back.
            </h2>

            <p className="bs-subtitle">
              Sign in to access your accounts,
              transfers and financial activity.
            </p>


            {error && (
              <div className="bs-error">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div className="bs-field">

                <label
                  className="bs-label"
                  htmlFor="email"
                >
                  Email address
                </label>

                <div className="bs-input-wrap">

                  <FiMail
                    className="bs-field-icon"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="bs-field">

                <label
                  className="bs-label"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="bs-input-wrap">

                  <FiLock
                    className="bs-field-icon"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                      paddingRight: "42px",
                    }}
                  />

                  <span
                    className="bs-toggle-icon"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </span>

                </div>

              </div>


              {/* FORGOT */}

              <div className="bs-forgot-row">

                <a
                  href="#forgot"
                  onClick={openForgot}
                >
                  Forgot password?
                </a>

              </div>


              {/* LOGIN */}

              <button
                className="bs-btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>


            <p className="bs-security-note">
              <FiLock />
              Your connection to BankSphere
              is encrypted and secure.
            </p>


            <p className="bs-footer-text">

              Don't have an account?{" "}

              <Link to="/register">
                Create one
              </Link>

            </p>

          </div>

        </section>

      </div>

    </AuthShell>
  );
};

export default Login;