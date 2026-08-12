import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    const userRoles = user.roles || [user.role]; // supports both real backend (roles[]) and admin bypass (role string)
    const normalizedRoles = userRoles.map((r) => (r || "").replace("ROLE_", ""));
    if (!normalizedRoles.includes(allowedRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;