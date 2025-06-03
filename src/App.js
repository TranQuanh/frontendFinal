import './App.css';
import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useNavigate
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import RequireLogin from "./components/RequireLogin";

const AppContent = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        navigate(`/`);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TopBar user={currentUser} onLogout={handleLogout} />
                </Grid>
            </Grid>

            <div className="main-topbar-buffer" />

            <Routes>
                <Route
                    path="/"
                    element={
                        <RequireLogin user={currentUser}>
                            <Navigate to="/users" replace />
                        </RequireLogin>
                    }
                />

                <Route
                    path="/login"
                    element={<LoginRegister onLoginSuccess={handleLoginSuccess} />}
                />

                <Route
                    path="/users/:userId"
                    element={
                        <RequireLogin user={currentUser}>
                            <Grid container spacing={2}>
                                <Grid item sm={3}>
                                    <Paper className="main-grid-item">
                                        <UserList />
                                    </Paper>
                                </Grid>
                                <Grid item sm={9}>
                                    <Paper className="main-grid-item">
                                        <UserDetail />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </RequireLogin>
                    }
                />

                <Route
                    path="/photos/:userId"
                    element={
                        <RequireLogin user={currentUser}>
                            <Grid container spacing={2}>
                                <Grid item sm={3}>
                                    <Paper className="main-grid-item">
                                        <UserList />
                                    </Paper>
                                </Grid>
                                <Grid item sm={9}>
                                    <Paper className="main-grid-item">
                                        <UserPhotos />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </RequireLogin>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <RequireLogin user={currentUser}>
                            <Grid container spacing={2}>
                                <Grid item sm={3}>
                                    <Paper className="main-grid-item">
                                        <UserList />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </RequireLogin>
                    }
                />
            </Routes>
        </>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
