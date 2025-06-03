import React from "react";
import { Navigate } from "react-router-dom";

const RequireLogin = ({ user, children }) => {
    console.log(user);
    return user ? children : <Navigate to="/login" replace />;
};

export default RequireLogin;
