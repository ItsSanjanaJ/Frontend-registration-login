import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { logoutUser } from "../services/api";

/**
 * Protected home page.
 * The username is provided by ProtectedRoute, which obtained it from the
 * backend via GET /api/auth/me - the frontend never trusts local state alone.
 */
export default function Home() {
  // user = the UserResponse returned by the backend (id, username, email, phone)
  const { user } = useOutletContext();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Revokes the token on the server and clears the HttpOnly cookie.
      await logoutUser();
    } catch (error) {
      // Even if the call fails, send the user back to the login page.
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="card text-center">
      <h1>Welcome, {user.username}!</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout} disabled={loggingOut}>
        {loggingOut ? "Logging out…" : "Logout"}
      </button>
    </div>
  );
}