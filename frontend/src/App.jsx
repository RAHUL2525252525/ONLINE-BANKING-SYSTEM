import "./App.css";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminLoans from "./pages/admin/AdminLoans";

import Accounts from "./pages/account/Accounts";
import Transactions from "./pages/transaction/Transactions";
import Beneficiaries from "./pages/beneficiary/Beneficiaries";
import Loans from "./pages/loan/Loans";
import Profile from "./pages/profile/Profile";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="USER">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounts"
            element={
              <ProtectedRoute allowedRole="USER">
                <Accounts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRole="USER">
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/beneficiaries"
            element={
              <ProtectedRoute allowedRole="USER">
                <Beneficiaries />
              </ProtectedRoute>
            }
          />

          <Route
            path="/loans"
            element={
              <ProtectedRoute allowedRole="USER">
                <Loans />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="USER">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminUserDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/loans"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLoans />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;