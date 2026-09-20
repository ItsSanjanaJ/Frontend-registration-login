import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

/**
 * Login form.
 * POSTs to /api/auth/login; the backend sets the HttpOnly JWT cookie.
 */
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Optional: land back on the page the user originally wanted.
  const from = location.state?.from?.pathname || "/home";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username must not be empty";
    if (!form.password) errs.password = "Password must not be empty";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // withCredentials is set globally in api.js, so the browser will send
      // the JWT cookie automatically on all following requests.
      const res = await loginUser({
        username: form.username.trim(),
        password: form.password,
      });
      setServerMessage(res.data.message || "Login successful");
      navigate(from, { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Login failed. Please try again.";
      setServerMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>

      {serverMessage && (
        <p className="alert error">{serverMessage}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <p className="field-error">{errors.username}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="switch-link">
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}