import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import API from './API';

const ProtectedAdminRoute = () => {

    const [isAdmin, setisAdmin] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await API.get("/admin/check", { withCredentials: true, });
                setisAdmin(response.data.isAdmin);
            } catch (error) {
                console.error("Error validating token:", error);
                setisAdmin(false);
            }
        };

        checkAdmin();
    }, []);

    // console.log("isAdmin from ProtectedAdminROute = ", isAdmin);

    if (isAdmin === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
                <CircularProgress />
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;
