import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Boxes,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { label: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { label: "Stock Management", icon: <Boxes size={20} />, path: "/admin/all-stocks" },
    // { label: "Reports", icon: <FileText size={20} />, path: "/admin/reports" },
    // { label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
];

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div
            className={`h-screen border-r border-gray-200 bg-white text-gray-800 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                } shadow-sm`}
        >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                {!collapsed && <h2 className="text-xl font-semibold tracking-tight">Admin</h2>}
                <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-800">
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
                {menuItems.map(({ label, icon, path }) => {
                    const isActive = location.pathname.startsWith(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? "bg-blue-100 text-blue-600"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {icon}
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}

                {/* <button className="flex items-center gap-3 px-4 py-2 mx-2 mt-6 rounded-lg text-sm font-medium text-red-500 hover:bg-red-100">
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button> */}
            </nav>
        </div>
    );
};

export default AdminSidebar;
