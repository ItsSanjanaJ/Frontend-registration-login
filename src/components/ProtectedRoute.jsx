import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/api";

/**
 * Route protection component.
 *
 * When the user visits /home, this component calls the protected
 * backend endpoint GET /api/auth/me (withCredentials) to ask the backend
 * whether the JWT cookie is valid. The backend is the final authority -
 * the frontend does not guess authentication based on local state.
 *
 * - Request in progress -> show a small loading screen.
 * - Backend rejects (401) -> redirect to /login.
 * - Backend accepts      -> render the route and expose the user object.
 */
export default function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card text-center">Checking authentication…</div>;
  }

  if (!user) {
    // Remember where the user wanted to go so we could return them later.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet context={{ user }} />;
}