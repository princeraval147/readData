import React, { useEffect, useState } from "react";
import API from "../../API"; // your axios instance

const Users = () => {
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
            alert("user Approved");
            fetchUsers();
        } catch (err) {
            console.error("Action failed", err);
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
            alert("user Deactivated");
            fetchUsers();
        } catch (err) {
            console.error("Action failed", err);
        }
    };


    console.log("User Data = ", users)


    return (
        <div>
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending User Approvals</h2> */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All User</h2>
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                        <tr>
                            <th className="p-4">Username</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Registered</th>
                            <th className="p-4">Last Login At</th>
                            <th className="p-4">Actions</th>
                            <th className="p-4">Deactivate User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.ID} className="border-b">
                                <td className="p-4">{user.USERNAME}</td>
                                <td className="p-4">{user.EMAIL}</td>
                                <td className="p-4">{user.COMPANY || "-"}</td>
                                <td className="p-4">{new Date(user.REGISTER_AT).toLocaleDateString()}</td>
                                <td className="p-4">{new Date(user.LAST_LOGIN).toLocaleDateString()}</td>
                                {
                                    !user.ISAPPROVED ?
                                        <td className="p-4 space-x-2">
                                            <button
                                                onClick={() => handleAction(user.ID, true)}
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Approve
                                            </button>
                                        </td>
                                        :
                                        <td className="p-4 space-x-2">
                                            <button
                                                onClick={() => DeactivateUser(user.ID, false)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                            >
                                                Deactivate
                                            </button>
                                        </td>
                                }
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
