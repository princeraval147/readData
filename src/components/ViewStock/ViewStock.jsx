import React, { useState, useEffect, useCallback } from 'react';
import API from '../../API';
import StockTable from '../Stock Data/StockTable';
import { Button } from '@mui/material';
import { CheckCircle, Pause } from '@mui/icons-material';
import { ShoppingCart } from 'lucide-react';

const ViewStock = () => {
    const [token, setToken] = useState('');
    const [stockData, setStockData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedTokens, setSavedTokens] = useState([]);

    const [rowData, setRowData] = useState([]);



    // Load from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem('diamond_api_key');
        if (stored) {
            setToken(stored);
        }
        const list = JSON.parse(localStorage.getItem('diamond_api_key_history')) || [];
        setSavedTokens(list);
    }, []);

    const handleFetch = async () => {
        setError('');
        setStockData([]);
        setLoading(true);

        try {
            const res = await API.get("/view-stock", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStockData(res.data);
            localStorage.setItem('diamond_api_key', token);

            // Save to history if new
            let history = JSON.parse(localStorage.getItem('diamond_api_key_history')) || [];
            if (!history.includes(token)) {
                history.push(token);
                localStorage.setItem('diamond_api_key_history', JSON.stringify(history));
                setSavedTokens(history);
            }

        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('❌ Unauthorized: Missing or invalid token format.');
                } else if (err.response.status === 403) {
                    setError('⛔ Access denied: Token is invalid or inactive.');
                } else {
                    setError('⚠️ Error fetching data. Please try again later.');
                }
            } else {
                setError('❗ Something went wrong');
                console.log("server error:", err);
            }
        }

        setLoading(false);
    };

    const handleStatus = async () => {
        if (!token || !rowData?.STOCKID) return;

        const isCurrentlyHold = rowData.STATUS === 'HOLD';
        const endpoint = isCurrentlyHold ? '/unhold-stock' : '/hold-stock';
        const actionText = isCurrentlyHold ? 'Make Available' : 'Hold';

        try {
            const response = await API.put(endpoint,
                {
                    stocks: [
                        {
                            stock_id: rowData.STOCKID,
                            certificate_number: rowData.CERTIFICATE_NUMBER || null,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = response.data.updatedStock?.[0];
            if (result?.status === (isCurrentlyHold ? 'AVAILABLE' : 'HOLD')) {
                alert(`✅ Stock ${rowData.STOCKID} ${isCurrentlyHold ? 'made available' : 'hold'} successfully.`);
                handleFetch(); // Refresh data
                setRowData([]);
            } else {
                alert(`⚠️ ${result?.message || `Failed to ${actionText.toLowerCase()} stock.`}`);
            }

        } catch (error) {
            console.error(`${actionText} API error:`, error);
            if (error.response?.status === 403) {
                alert(`⛔ You do not have permission to ${actionText.toLowerCase()} stock.`);
            } else {
                alert(`❗ Failed to ${actionText.toLowerCase()} stock. Please try again.`);
            }
        }
    };

    const handleSell = async () => {
        if (!token || !rowData?.STOCKID) {
            alert("❗ Missing token or stock ID.");
            return;
        }

        if (!window.confirm("Are you sure you want to sell this stock?")) {
            return;
        }
        console.log("Selling stock:", rowData.STOCKID);
        try {
            const response = await API.post(
                '/sell-stock',
                {
                    stock_id: rowData.STOCKID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(`✅ ${response.data.message || 'Stock sold successfully.'}`);
            handleFetch(); // Refresh the table or stock list
        } catch (error) {
            console.error("Sell API error:", error);

            if (error.response) {
                const status = error.response.status;

                if (status === 403) {
                    alert('⛔ You do not have permission to sell stock.');
                } else if (status === 404) {
                    alert('❌ Stock not found or unauthorized.');
                } else if (status === 400) {
                    alert('⚠️ Missing required data (stock ID).');
                } else {
                    alert('❗ Failed to sell stock. Please try again.');
                }
            } else {
                alert('❗ Network error or server is down.');
            }
        }
    };




    const handleRowClick = useCallback((row) => {
        setRowData(row);
    }, []);



    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow p-6 rounded-lg mb-6 space-y-4 border border-gray-200">
                <div>
                    <label htmlFor="api-token" className="block font-medium mb-1">
                        API Token
                    </label>

                    {/* Datalist for suggestions */}
                    <input
                        id="api-token"
                        list="saved-tokens"
                        type="text"
                        placeholder="Paste your API key here"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id="saved-tokens">
                        {savedTokens.map((tok, i) => (
                            <option key={i} value={tok} />
                        ))}
                    </datalist>
                </div>

                <span className='flex justify-around items-center space-x-4'>
                    <span>
                        <button
                            onClick={handleFetch}
                            disabled={token.length !== 16 || loading}
                            className={`px-6 py-2 rounded text-white font-medium transition ${loading || token.length !== 16
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? '🔄 Loading...' : '📦 Fetch Stock'}
                        </button>
                    </span>

                    <span className='flex gap-4'>
                        <Button
                            variant="contained"
                            color={rowData.STATUS === 'HOLD' ? 'success' : 'warning'}
                            startIcon={rowData.STATUS === 'HOLD' ? <CheckCircle /> : <Pause />}
                            onClick={handleStatus}
                            disabled={!rowData || rowData.length === 0}
                        >
                            {rowData.STATUS === 'HOLD' ? 'Make Available' : 'Hold'}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<ShoppingCart />}
                            onClick={handleSell}
                            disabled={rowData.length === 0}
                        >
                            Sell
                        </Button>
                    </span>
                </span>

                {error && <div className="text-red-600 font-medium">{error}</div>}
                {loading && !error && <div className="text-blue-500">Fetching your stock data...</div>}
            </div>

            {stockData.length > 0 && (
                <StockTable
                    stocks={stockData}
                    onRowClick={handleRowClick}
                    showAllColumns={false}
                />
            )}
        </div>
    );
};

export default ViewStock;
