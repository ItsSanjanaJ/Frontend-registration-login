import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* /home is wrapped in ProtectedRoute: unauthenticated users are
          redirected to /login before Home is rendered. */}
      <Route path="/home" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
      </Route>

      {/* Any unknown path falls back to the home page */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}