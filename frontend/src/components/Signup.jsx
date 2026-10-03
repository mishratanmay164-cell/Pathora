import { useState } from "react";
import "./Signup.css";

function Signup({ onBack, onLogin, onAccountCreated }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // HANDLE SIGNUP
  // ============================================================

  const handleSignup = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // ==========================================================
    // CREATE USER ACCOUNT
    // ==========================================================

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    // Send account details to App.jsx
    if (onAccountCreated) {
      onAccountCreated(userData);
    } else {
      // Fallback in case the callback is not connected
      alert(
        "Account created successfully! Welcome to Pathora."
      );

      if (onLogin) {
        onLogin();
      }
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="signup-page">

      <div className="signup-background"></div>

      <div className="signup-container">

        {/* ======================================================
            BACK BUTTON
        ====================================================== */}

        <button
          className="signup-back-button"
          onClick={onBack}
        >
          ← Back to Pathora
        </button>

        {/* ======================================================
            SIGNUP CARD
        ====================================================== */}

        <div className="signup-card">

          {/* ====================================================
              LOGO
          ==================================================== */}

          <div className="signup-logo">

            <img
              src="/pathora-logo.png"
              alt="Pathora Logo"
            />

            <span>
              Path<span>ora</span>
            </span>

          </div>

          {/* ====================================================
              HEADING
          ==================================================== */}

          <h1>
            Create Your Account
          </h1>

          <p className="signup-subtitle">
            Start your personalized career journey
            with Pathora AI.
          </p>

          {/* ====================================================
              SIGNUP FORM
          ==================================================== */}

          <form onSubmit={handleSignup}>

            {/* ==================================================
                FULL NAME
            ================================================== */}

            <div className="signup-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
              />

            </div>

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="signup-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
              />

            </div>

            {/* ==================================================
                PASSWORD
            ================================================== */}

            <div className="signup-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="signup-password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="signup-show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <small>
                Password must contain at least 6 characters.
              </small>

            </div>

            {/* ==================================================
                CONFIRM PASSWORD
            ================================================== */}

            <div className="signup-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="signup-password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="signup-show-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* ==================================================
                TERMS
            ================================================== */}

            <div className="signup-terms">

              <label>

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to Pathora's Terms & Conditions
                </span>

              </label>

            </div>

            {/* ==================================================
                CREATE ACCOUNT BUTTON
            ================================================== */}

            <button
              type="submit"
              className="signup-submit"
            >
              Create My Account
            </button>

          </form>

          {/* ====================================================
              DIVIDER
          ==================================================== */}

          <div className="signup-divider">

            <span>
              OR
            </span>

          </div>

          {/* ====================================================
              LOGIN
          ==================================================== */}

          <p className="login-text">

            Already have an account?

            <button
              type="button"
              onClick={onLogin}
            >
              Login to Pathora
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;