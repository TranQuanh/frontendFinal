import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

import "./styles.css";

function TopBar({ user, onLogout }) {
  //logout
  const handleLogout = async () => {
    try {
      await fetch("https://3c7cpk-8081.csb.app/api/user/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      onLogout();
    } catch (err) {
      console.log(err);
      onLogout();
    }
  };

  //upload anh
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    try {
      const response = await fetch(
        "https://3c7cpk-8081.csb.app/api/photo/photos/new",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      console.log(response);
      const result = await response.json(); // Parse JSON data
      console.log("Parsed data:", result);
      if (!response.ok) {
        throw new Error("upload failed");
      }
      alert("Successfully uploaded");
    } catch (error) {
      console.log(error);
      alert("Error uploading file");
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="inherit">
          Phạm Xuân Quý - B22DCAT240
        </Typography>

        <div className="topbar-right">
          {user ? (
            <>
              <div className="upload-photo-container">
                <label htmlFor="photo-upload" className="upload-button">
                  Add Photo
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="user-info">
                <span className="greeting">Hi {user.first_name}</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <span className="login-prompt">Please Login</span>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
