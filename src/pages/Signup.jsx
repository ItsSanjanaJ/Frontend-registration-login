import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

/**
 * Registration form.
 * Validates fields on the client first, then POSTs to /api/users/signup.
 */
export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Client-side validation. Returns an object of field -> message.
   * All fields are required; confirm password must match; email and phone
   * must look correct.
   */
  const validate = () => {
    const errs = {};

    if (!form.username.trim()) {
      errs.username = "Username must not be empty";
    } else if (form.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters";
    }

    if (!form.password) {
      errs.password = "Password must not be empty";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Confirm password must not be empty";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = "Email must not be empty";
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = "Enter a valid email address";
    }

    const phoneRegex = /^[0-9 +-]{7,20}$/;
    if (!form.phone.trim()) {
      errs.phone = "Phone must not be empty";
    } else if (!phoneRegex.test(form.phone.trim())) {
      errs.phone = "Phone must contain 7 to 20 digits";
    }

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

    setLoading(true); // disables the button while the request runs
    try {
      // The plain password is sent once over the network to be BCrypt hashed
      // on the server; it is never stored anywhere in the browser.
      const res = await signupUser({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setServerMessage(res.data.message || "Registration successful");

      // After a successful signup, send the user to the login page.
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Registration failed. Please try again.";
      setServerMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Create Account</h1>

      {serverMessage && (
        <p className={serverMessage.includes("success") || serverMessage === "Registration successful"
            ? "alert success"
            : "alert error"}>
          {serverMessage}
        </p>
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        {errors.phone && <p className="field-error">{errors.phone}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing up…" : "Sign Up"}
        </button>
      </form>

      <p className="switch-link">
        Already a user? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}