import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiTrendingUp,
  FiSmartphone,
} from "react-icons/fi";

import { registerUser } from "../../services/authService";

import AuthShell from "./AuthShell";

import "./auth.css";


const Register = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();


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

      await registerUser(formData);

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

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
          Your money.
          <br />
          Your control.
          <br />
          Your future.
        </h1>

        <p>
          Create your BankSphere account and
          experience a simpler, faster and more
          secure way to manage your finances.
        </p>


        <div className="bs-brand-features">

          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiShield />
            </div>

            <strong>
              Protected
            </strong>

            <span>
              Your information stays
              protected.
            </span>

          </div>


          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiTrendingUp />
            </div>

            <strong>
              Connected
            </strong>

            <span>
              Manage your money
              from one place.
            </span>

          </div>


          <div className="bs-brand-feature">

            <div className="bs-brand-feature-icon">
              <FiSmartphone />
            </div>

            <strong>
              Flexible
            </strong>

            <span>
              Banking wherever
              you are.
            </span>

          </div>

        </div>

      </div>

    </section>
  );


  return (

    <AuthShell>

      <div className="bs-split">

        {brandPanel}


        <section className="bs-form-panel">

          <div className="bs-card">

            <h2>
              Open your account.
            </h2>

            <p className="bs-subtitle">
              Join BankSphere and start managing
              your finances in minutes.
            </p>


            {error && (
              <div className="bs-error">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}

              <div className="bs-field">

                <label
                  className="bs-label"
                  htmlFor="fullName"
                >
                  Full name
                </label>

                <div className="bs-input-wrap">

                  <FiUser
                    className="bs-field-icon"
                  />

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="As per your ID"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


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


              {/* PHONE */}

              <div className="bs-field">

                <label
                  className="bs-label"
                  htmlFor="phoneNumber"
                >
                  Phone number
                </label>

                <div className="bs-input-wrap">

                  <FiPhone
                    className="bs-field-icon"
                  />

                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
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
                    placeholder="Create a password"
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


              {/* REGISTER */}

              <button
                className="bs-btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>


            <p className="bs-security-note">
              <FiLock />
              Your information is protected
              with bank-grade encryption.
            </p>


            <p className="bs-footer-text">

              Already have an account?{" "}

              <Link to="/login">
                Sign in
              </Link>

            </p>

          </div>

        </section>

      </div>

    </AuthShell>
  );
};

export default Register;