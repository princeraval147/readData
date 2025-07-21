import React, { useState, useEffect } from 'react';
import API from '../../API';
import StockTable from '../Stock Data/StockTable';

const ViewStock = () => {
    const [token, setToken] = useState('');
    const [stockData, setStockData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedTokens, setSavedTokens] = useState([]);

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
            }
        }

        setLoading(false);
    };

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

                {error && <div className="text-red-600 font-medium">{error}</div>}
                {loading && !error && <div className="text-blue-500">Fetching your stock data...</div>}
            </div>

            {stockData.length > 0 && (
                <StockTable
                    stocks={stockData}
                    onRowClick={(row) => console.log("Clicked row:", row)}
                    showAllColumns={false}
                />
            )}
        </div>
    );
};

export default ViewStock;
