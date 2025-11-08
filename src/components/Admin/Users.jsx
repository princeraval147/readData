import React, { useEffect, useState } from "react";
import API from "../../API";
import { useNotification } from '../../context/NotificationContext';

const Users = () => {

    const { showMessage } = useNotification();
    const [users, setUsers] = useState([]);

    // Fetch pending users
    const fetchUsers = async () => {
        try {
            const res = await API.get("/admin/all-users", { withCredentials: true });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (id) => {
        console.log("Id", id);
        try {
            await API.post(
                `/admin/approve-user`,
                { id },
                { withCredentials: true }
            );
            showMessage("user Approved", "success");
            fetchUsers();
        } catch (err) {
            console.error("Action failed", err);
            showMessage("Something Went Wrong !", "error");
        }
    };

    const DeactivateUser = async (id) => {
        console.log("Id", id);
        try {
            await API.post(
                `/admin/deactivate-user`,
                { id },
                { withCredentials: true }
            );
            showMessage("user Deactivated", "success");
            fetchUsers();
        } catch (err) {
            console.error("Action failed", err);
            showMessage("something Went Wrong !", "error");
        }
    };


    console.log("User Data = ", users)


    return (
        <div>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left hidden md:table-cell">Company</th>
                            <th className="p-3 text-left hidden sm:table-cell">Registered</th>
                            <th className="p-3 text-left hidden lg:table-cell">Last Login</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.ID} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-medium text-gray-800">{user.USERNAME}</td>
                                <td className="p-3">{user.EMAIL}</td>
                                <td className="p-3 hidden md:table-cell">{user.COMPANY || "-"}</td>
                                <td className="p-3 hidden sm:table-cell">{new Date(user.REGISTER_AT).toLocaleDateString()}</td>
                                <td className="p-3 hidden lg:table-cell">{new Date(user.LAST_LOGIN).toLocaleDateString()}</td>
                                <td className="p-3 space-x-2">
                                    {!user.ISAPPROVED ? (
                                        <button
                                            onClick={() => handleAction(user.ID)}
                                            className="px-4 py-1 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => DeactivateUser(user.ID)}
                                            className="px-4 py-1 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                                        >
                                            Deactivate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
