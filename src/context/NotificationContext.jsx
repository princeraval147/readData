import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info", // "success" | "error" | "warning" | "info"
    });

    // Function to show notification
    const showMessage = useCallback((message, severity = "info") => {
        setNotification({ open: true, message, severity });
    }, []);

    // Close handler
    const handleClose = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000} // auto close after 3s
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }} // position
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

// Custom hook
export const useNotification = () => useContext(NotificationContext);
