import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../service/authService";

function LoginPage() {
  const [cccd, setCccd] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cccd || !password) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    try {
      await authService.login({ cccd, password });
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || "CCCD hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-form">
        <h2 className="text-center">Đăng nhập</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cccd">CCCD: </label>
            <input
              type="text"
              id="cccd"
              value={cccd}
              onChange={(e) => setCccd(e.target.value)}
              required
              className="input-field"
              maxLength="12"
              pattern="[0-9]{12}"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              minLength="6"
            />
          </div>

          <button type="submit" className="submit-btn">
            Đăng nhập
          </button>
        </form>

        <div className="forgot-password pt-4">
          <Link to="/forgot">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
