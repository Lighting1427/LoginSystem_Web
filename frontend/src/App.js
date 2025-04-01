import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UpdateUserForm from "./components/UpdateUserForm";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLoginSuccess = (accessToken) => {
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            !token ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Navigate to="/app" replace />
            )
          }
        />
        <Route
          path="/app"
          element={
            token ? (
              <UserManagement token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* default */}
        <Route
          path="*"
          element={<Navigate to={token ? "/app" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

function UserManagement({ token, onLogout }) {
  const [refresh, setRefresh] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const handleUserCreated = () => {
    setRefresh(!refresh);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
  };

  const handleUserUpdated = () => {
    setEditingUserId(null);
    setRefresh(!refresh);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  return (
    <div className="app-container">
      <h1>User Management App</h1>
      <button onClick={onLogout}>Logout</button>

      {!editingUserId && (
        <UserForm token={token} onUserCreated={handleUserCreated} />
      )}

      {editingUserId && (
        <UpdateUserForm
          userId={editingUserId}
          token={token}
          onUpdated={handleUserUpdated}
          onCancel={handleCancelEdit}
        />
      )}

      <UserList token={token} refresh={refresh} onEdit={handleEditUser} />
    </div>
  );
}

export default App;
