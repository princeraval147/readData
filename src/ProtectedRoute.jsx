import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import API from './API';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await API.get("/auth/validate-token", {
                    withCredentials: true, // Important: Sends cookies
                });

                setIsAuthenticated(response.data.valid);
            } catch (error) {
                console.error("Error validating token:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
                <CircularProgress />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
