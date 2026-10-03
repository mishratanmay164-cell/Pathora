import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword({ registeredUser, onBack, onPasswordReset }) {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyEmail = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!registeredUser) {
      alert("No account found. Please create an account first.");
      return;
    }

    if (
      email.trim().toLowerCase() !==
      registeredUser.email.toLowerCase()
    ) {
      alert("No account found with this email address.");
      return;
    }

    setVerified(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (onPasswordReset) {
  onPasswordReset(newPassword);
}

    alert("Password reset successfully! You can now login with your new password.");

    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-background"></div>

      <div className="forgot-container">

        <button
          className="forgot-back-button"
          onClick={onBack}
        >
          ← Back to Login
        </button>

        <div className="forgot-card">

          <div className="forgot-logo">

            <img
              src="/pathora-logo.png"
              alt="Pathora Logo"
            />

            <span>
              Path<span>ora</span>
            </span>

          </div>

          {!verified ? (
            <>
              <h1>Forgot Password?</h1>

              <p className="forgot-subtitle">
                Enter your registered email address and we'll help
                you reset your password.
              </p>

              <form onSubmit={handleVerifyEmail}>

                <div className="forgot-form-group">

                  <label htmlFor="forgot-email">
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                </div>

                <button
                  type="submit"
                  className="forgot-submit"
                >
                  Continue
                </button>

              </form>

              <p className="forgot-login-text">
                Remember your password?

                <button
                  type="button"
                  onClick={onBack}
                >
                  Login to Pathora
                </button>
              </p>
            </>
          ) : (
            <>
              <h1>Create New Password</h1>

              <p className="forgot-subtitle">
                Create a new password for your Pathora account.
              </p>

              <form onSubmit={handleResetPassword}>

                <div className="forgot-form-group">

                  <label htmlFor="new-password">
                    New Password
                  </label>

                  <div className="forgot-password-wrapper">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      id="new-password"
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="forgot-show-password"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                  <small>
                    Password must contain at least 6 characters.
                  </small>

                </div>

                <div className="forgot-form-group">

                  <label htmlFor="confirm-new-password">
                    Confirm New Password
                  </label>

                  <div className="forgot-password-wrapper">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      id="confirm-new-password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="forgot-show-password"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

                <button
                  type="submit"
                  className="forgot-submit"
                >
                  Reset Password
                </button>

              </form>

              <p className="forgot-login-text">
                Changed your mind?

                <button
                  type="button"
                  onClick={onBack}
                >
                  Back to Login
                </button>
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;