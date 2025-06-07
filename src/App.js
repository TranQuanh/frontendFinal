import "./App.css";

import React from "react";
import { Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import { API_BASE_URL } from "./config";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [photoUpdateTrigger, setPhotoUpdateTrigger] = useState(false);

  // Kiểm tra auth khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/check-auth`, {
          credentials: "include",
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setCurrentUser(null);
      } finally {
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (data) => {
    setCurrentUser(data.user);
    navigate(`/users/${data.user._id}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      <TopBar
        user={currentUser}
        onLogout={handleLogout}
        onPhotoUpload={() => setPhotoUpdateTrigger((prev) => !prev)}
      />
      <div className="main">
        <div
          style={{
            display: "flex",
            marginTop: "64px",
            height: "calc(100vh - 64px)",
          }}
        >
          {currentUser && (
            <div style={{ width: "20%", height: "100%" }}>
              <UserList />
            </div>
          )}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Routes>
              <Route
                path="/login"
                element={
                  currentUser ? (
                    <Navigate to={`/users/${currentUser._id}`} replace />
                  ) : (
                    <LoginRegister onLoginSuccess={handleLoginSuccess} />
                  )
                }
              />
              <Route
                path="/"
                element={
                  currentUser ? (
                    <Navigate to={`/users/${currentUser._id}`} replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="users/:userId"
                element={
                  currentUser ? (
                    <UserDetail />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="photos/:userId"
                element={
                  currentUser ? (
                    <UserPhotos photoUpdateTrigger={photoUpdateTrigger} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="users"
                element={
                  currentUser ? (
                    <h1>Please select a user from the list.</h1>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
