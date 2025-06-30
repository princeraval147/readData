import React, { useEffect, useState } from "react";
import API from "../../API";

const Dashboard = () => {

    const [totalUser, setTotalUsers] = useState();
    const [totalStock, setTotalStocks] = useState();

    const totalUsers = async () => {
        try {
            const res = await API.get("/admin/total-users");
            setTotalUsers(res.data[0].TOTALUSERS);
        } catch (error) {
            console.error("Server Error", error);
        }
    }

    const totalStocks = async () => {
        try {
            const res = await API.get("/admin/total-stocks");
            setTotalStocks(res.data[0].TOTALSTOCK);
        } catch (error) {
            console.error("Server Error", error);
        }
    }

    useEffect(() => {
        totalUsers();
        totalStocks();
    }, []);

    // console.log(totalUser)

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Users" value={totalUser} />
                <Card title="Total Stock" value={totalStock} />
                {/* <Card title="Reports Generated" value="37" /> */}
                {/* <Card title="Active Employees" value="19" /> */}
            </div>

            {/* Chart Placeholder */}
            {/* <div className="bg-white rounded-2xl shadow p-6 h-64 flex items-center justify-center text-gray-400">
                [ Stock Movement Chart (Coming Soon) ]
            </div> */}

            {/* Latest Activity Table */}
            {/* <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Stock Updates</h2>
                <table className="w-full table-auto text-sm">
                    <thead>
                        <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2">Stock ID</th>
                            <th className="pb-2">Shape</th>
                            <th className="pb-2">Weight</th>
                            <th className="pb-2">Updated By</th>
                            <th className="pb-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: "STK-001", shape: "Round", weight: "1.25 ct", user: "Manav", date: "2025-06-27" },
                            { id: "STK-002", shape: "Oval", weight: "0.90 ct", user: "Priya", date: "2025-06-26" },
                            { id: "STK-003", shape: "Princess", weight: "1.05 ct", user: "Prince", date: "2025-06-25" },
                        ].map((item) => (
                            <tr key={item.id} className="border-b text-gray-700">
                                <td className="py-2">{item.id}</td>
                                <td className="py-2">{item.shape}</td>
                                <td className="py-2">{item.weight}</td>
                                <td className="py-2">{item.user}</td>
                                <td className="py-2">{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
    );
};

const Card = ({ title, value }) => (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
    </div>
);

export default Dashboard;
