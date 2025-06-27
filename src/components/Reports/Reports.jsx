import React, { useEffect, useState, useRef } from 'react';
import API from '../../API';
import { CSVLink } from 'react-csv';


const Reports = () => {


    const [activeTab, setActiveTab] = useState('sold');
    const [soldData, setSoldData] = useState([]);
    const [holdData, setHoldData] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [partySearch, setPartySearch] = useState('');


    useEffect(() => {
        API.get('/sell_data', { withCredentials: true }).then(r => setSoldData(r.data));
        API.get('/hold_data', { withCredentials: true }).then(r => setHoldData(r.data));
    }, []);

    const formatDate = dateString => {
        const d = new Date(dateString);
        return d.toLocaleString('en-GB');
    };

    const getFiltered = (data) =>
        data.filter(item => {
            const itemDate = new Date(item.SELL_DATE || item.HOLD_DATE);
            const textMatch = `${item.STONE_ID} ${item.STATUS}`.toLowerCase().includes(search.toLowerCase());

            const partyMatch = item.PARTY
                ? item.PARTY.toLowerCase().includes(partySearch.toLowerCase())
                : false;

            let isInRange = true;
            if (fromDate) {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                isInRange = itemDate >= from;
            }
            if (toDate && isInRange) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                isInRange = itemDate <= to;
            }

            return textMatch && partyMatch && isInRange;
        });

    const dataset = activeTab === 'sold' ? soldData : holdData;
    const filtered = getFiltered(dataset);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const headers = [
        { label: '#', key: 'index' },
        { label: 'Stone ID', key: 'STONE_ID' },
        { label: 'Weight', key: 'WEIGHT' },
        { label: 'Price Per Carat', key: 'PRICE_PER_CARAT' },
        { label: 'Final Price', key: 'FINAL_PRICE' },
        { label: 'Date', key: 'DATE' },
        { label: 'Status', key: 'STATUS' },
        { label: 'Party', key: 'PARTY' },
    ];
    const csvData = filtered.map((item, idx) => ({
        index: idx + 1,
        STONE_ID: item.STONE_ID,
        WEIGHT: item.WEIGHT,
        PRICE_PER_CARAT: item.PRICE_PER_CARAT,
        FINAL_PRICE: item.FINAL_PRICE,
        DATE: formatDate(item.SELL_DATE),
        STATUS: item.STATUS,
        PARTY: item.PARTY,
    }));





    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-800">Reports</h2>

            {/* Tabs */}
            <div className="flex justify-center gap-4">
                {['sold', 'hold'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setSearch('');
                            setCurrentPage(1);
                        }}
                        className={`cursor-pointer px-6 py-2 rounded-full text-white font-medium transition ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Report
                    </button>
                ))}
            </div>
            <div>
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-between items-start md:items-center">
                    <input
                        type="text"
                        placeholder="Search by Party..."
                        className="border rounded px-4 py-2 w-full md:w-auto"
                        value={partySearch}
                        onChange={(e) => {
                            setPartySearch(e.target.value.toUpperCase());
                            setCurrentPage(1);
                        }}
                    />

                    <input
                        type="date"
                        className="border rounded px-4 py-2 w-full md:w-auto"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <input
                        type="date"
                        className="border rounded px-4 py-2 w-full md:w-auto"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <button
                        onClick={() => {
                            setSearch('');
                            setFromDate('');
                            setToDate('');
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                    >
                        Clear Filters
                    </button>

                    <CSVLink data={csvData} headers={headers} filename={`${activeTab}-report.csv`}>
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Export CSV
                        </button>
                    </CSVLink>
                </div>
            </div>



            {/* Table */}
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-gray-300 rounded text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b">#</th>
                            <th className="px-4 py-2 border-b">Stone ID</th>
                            <th className="px-4 py-2 border-b">Weight</th>
                            <th className="px-4 py-2 border-b">Price Per Carat</th>
                            <th className="px-4 py-2 border-b">Final Price</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Party</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.length > 0 ? (
                            displayed.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                    <td className="px-4 py-2 border-b">{item.STONE_ID}</td>
                                    <td className="px-4 py-2 border-b">{item.WEIGHT}</td>
                                    <td className="px-4 py-2 border-b">{item.PRICE_PER_CARAT}</td>
                                    <td className="px-4 py-2 border-b">{item.FINAL_PRICE}</td>
                                    <td className="px-4 py-2 border-b">
                                        {formatDate(item.SELL_DATE)}
                                    </td>
                                    <td className="px-4 py-2 border-b">{item.STATUS}</td>
                                    <td className="px-4 py-2 border-b">{item.PARTY}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
};

export default Reports;
