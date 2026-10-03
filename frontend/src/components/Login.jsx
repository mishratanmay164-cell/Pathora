import { useState } from "react";
import "./Login.css";

function Login({
  onBack,
  onSignup,
  onLogin,
  onForgotPassword,
  registeredUser,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Check whether an account has been created
    if (!registeredUser) {
      alert("No account found. Please create an account first.");
      return;
    }

    // Check email and password
    if (
      email.toLowerCase() !== registeredUser.email.toLowerCase() ||
      password !== registeredUser.password
    ) {
      alert("Invalid email or password. Please try again.");
      return;
    }

    // Correct credentials
    alert(`Login successful! Welcome to Pathora, ${registeredUser.name}.`);

    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="login-page">

      <div className="login-background"></div>

      <div className="login-container">

        <button
          className="login-back-button"
          onClick={onBack}
        >
          ← Back to Pathora
        </button>

        <div className="login-card">

          <div className="login-logo">

            <img
              src="/pathora-logo.png"
              alt="Pathora Logo"
            />

            <span>
              Path<span>ora</span>
            </span>

          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Continue your career journey with Pathora AI.
          </p>

          <form onSubmit={handleLogin}>

            <div className="login-form-group">

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

            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                 type="button"
                 className="forgot-password"
                  onClick={onForgotPassword}
                 >
                  Forgot password?
                 </button>

              </div>

              <div className="password-input-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <div className="remember-me">

              <label>

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="login-submit"
            >
              Login to Pathora
            </button>

          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="signup-text">

            Don't have an account?

            <button
              type="button"
              onClick={onSignup}
            >
              Create an account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;