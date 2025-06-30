import React, { useEffect, useState } from "react";
import API from "../../API";

const AllStock = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        API.get("/admin/stock-by-user", { withCredentials: true })
            .then((res) => setData(res.data))
            .catch((err) => console.error("Failed to load stock by user", err));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Stock Count by User</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Stock Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.user_id} className="border-b">
                                <td className="p-4">{row.user_id}</td>
                                <td className="p-4">{row.USERNAME}</td>
                                <td className="p-4 font-medium">{row.stock_count}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-400">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllStock;
