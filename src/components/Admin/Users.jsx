import React, { useEffect, useState } from "react";
import API from "../../API"; // your axios instance

const Users = () => {
    const [users, setUsers] = useState([]);

    // Fetch pending users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await API.get("/admin/pending-users", { withCredentials: true });
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };

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
            setUsers(users.filter((u) => u.ID !== id)); // remove from list after action
            alert("user Approved");
        } catch (err) {
            console.error("Action failed", err);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending User Approvals</h2>
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Registered</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.ID} className="border-b">
                                <td className="p-4">{user.USERNAME}</td>
                                <td className="p-4">{user.EMAIL}</td>
                                <td className="p-4">{user.COMPANY || "-"}</td>
                                <td className="p-4">{new Date(user.REGISTER_AT).toLocaleDateString()}</td>
                                <td className="p-4 space-x-2">
                                    <button
                                        onClick={() => handleAction(user.ID, true)}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-400">
                                    No pending users
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
