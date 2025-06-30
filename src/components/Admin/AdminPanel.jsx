import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";

const AdminPanel = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
