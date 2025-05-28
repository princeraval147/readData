import React, { useState, useEffect, useRef, useCallback, useMemo, useTransition } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, Box,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './StockData.module.css';
import { trTR } from '@mui/material/locale';
import Slider from '@mui/material/Slider';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
// import debounce from 'lodash.debounce';
import StockTable from './StockTable';


const StockData = () => {

    const barcoderef = useRef(null);

    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const fetchDiamondStock = async () => {
        setLoading(true);
        setError(null); // reset previous error
        setStocks([]);

        try {
            const response = await Axios.get('http://localhost:5000/api/get-diamondstock', {
                withCredentials: true, // ✅ Sends cookies
            });
            setStocks(response.data);
        } catch (error) {
            console.error("Error fetching stock:", error);
            if (error.response?.status === 401) {
                alert("You are not authorized. Please log in.");
                navigate('/login');
            } else {
                setError("Failed to fetch stock data. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }


    // Loading
    // if (stocks.length === 0) return <div className={styles.loadingOverlay}>
    //     <CircularProgress size={60} color="primary" />
    // </div>

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            setStocks(jsonData); // Replace existing data
        };

        if (file) reader.readAsArrayBuffer(file);
    };

    // export to excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(stocks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "StockData");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "diamond_stock.xlsx");
    };


    // Send to DB
    const headerMapping = {
        'STOCK_': 'STOCK',
        'REPORT_': 'REPORT_NO',
        'TABLE_': 'TABLE_PERCENT',
        'DEPTH_': 'DEPTH_PERCENT',
        'PRICE_PER_CARAT': 'PRICE_PER_CARAT',
        'EYE_CLEAN': 'EYE_CLEAN',
        'FLUORESCENCE_INTENSITY': 'FLUORESCENCE_INTENSITY',
        'DIAMOND_VIDEO': 'DIAMOND_VIDEO',
        'DIAMOND_IMAGE': 'DIAMOND_IMAGE',
        'GROWTH_TYPE': 'GROWTH_TYPE',
        'FANCY_COLOR_INTENSITY': 'FANCY_COLOR_INTENSITY',
        'FANCY_COLOR': 'FANCY_COLOR',
        // Measurement1	Measurement2	Measurement3	
        'MEASUREMENT1': 'LENGTH',
        'MEASUREMENT2': 'WIDTH',
        'MEASUREMENT3': 'HEIGHT',
        'TABLE': 'TABLE_PERCENT',
        'DEPTH': 'DEPTH_PERCENT',
        'SYM': 'SYMMETRY',
        'REPORT_NUMBER': 'REPORT_NO',
        'CUSTOMER_REF_NO': 'STOCKID',
        'CULET_SIZE': 'CULET_SIZE',
        'GIRDLE_NAME': 'GIRDLE_CONDITION',
        'GIRDLE_PERCENT': 'GIRDLE_PER',
        'PAVILION_DEPTH': 'PAVILLION_DEPTH',
        'POL_OR_POLSYM': 'POLISH',
        'SHAPE_NAME': 'SHAPE',
        'COLOR_LONG': 'COLOR',
        'CUTDROP': 'CUT',
        'DOCUMENT_NO': 'CERTIFICATE_NUMBER',
    };


    function normalizeObjectKeys(data) {
        return data.map(obj => {
            const normalized = {};
            Object.entries(obj).forEach(([key, value]) => {
                const cleanedKey = key
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9_]/g, '')
                    .toUpperCase();
                const dbKey = headerMapping[cleanedKey] || cleanedKey;
                normalized[dbKey] = value ?? '';
            });
            return normalized;
        });
    }

    const uploadData = async () => {
        if (!Array.isArray(stocks) || stocks.length === 0) {
            alert("Invalid or empty data");
            return;
        }
        console.log("Data to be sent to DB: ", stocks[0]);
        const sendToDB = normalizeObjectKeys(stocks);
        console.log("Normalized data to be sent to DB: ", sendToDB[0]);
        try {
            const res = await Axios.post('http://localhost:5000/api/upload-excel', sendToDB);
            alert(res.data.message);
        } catch (error) {
            console.error("Internal Error:", error);
            alert("Upload failed");
        }
    };

    // DropDown Data
    const [shapeData, setShapeData] = useState([]);
    const [colorData, setColorData] = useState([]);
    const [clarityData, setClarityData] = useState([]);
    const [cutData, setCutData] = useState([]);
    // const [FLData, setFLData] = useState([]);

    const fetchDropDownData = async () => {
        try {
            const endpoints = [
                "shape",
                "color",
                "clarity",
                "cut"
                // "fl"
            ];
            const [shapeRes, colorRes, clarityRes, cutRes] = await Promise.all(
                endpoints.map(endpoint => Axios.get(`http://localhost:5000/api/${endpoint}`))
            );
            setShapeData(shapeRes.data);
            setColorData(colorRes.data);
            setClarityData(clarityRes.data);
            setCutData(cutRes.data);
            // setFLData(flRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchDropDownData();
    }, []);

    const [formData, setFormData] = useState({
        barcode: '',
        kapan: '',
        lot: '',
        tag: '',
        certificate: '',
        weight: '',
        shape: 'RD',
        color: 'D',
        clarity: 'IF',
        cut: 'EX',
        pol: 'EX',
        sym: 'EX',
        length: '',
        width: '',
        price: '',
        finalprice: '',
        party: '',
        due: ''
    });

    const resetFormData = () => {
        setFormData({
            barcode: '',
            kapan: '',
            lot: '',
            tag: '',
            certificate: '',
            weight: '',
            shape: 'RD',
            color: 'D',
            clarity: 'IF',
            cut: 'EX',
            pol: 'EX',
            sym: 'EX',
            length: '',
            width: '',
            price: '',
            finalprice: '',
            party: '',
            due: ''
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.toUpperCase(),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted: ", formData);
        resetFormData();
        try {
            Axios.post('http://localhost:5000/api/add-diamondstock', formData)
                .then((response) => {
                    console.log("Response from server:", response.data);
                    alert(response.data.message);
                    fetchDiamondStock(); // Refresh the stock data
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    alert("Failed to submit data");
                });
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
        setTimeout(() => {
            barcoderef.current.focus();
        }, 100);
    }

    const [rowData, setRowData] = useState([]);

    const handleStatus = async () => {
        const party = formData.party;
        if (!formData.party || formData.party.trim() === '') {
            alert("Please enter a party before putting stock on hold.");
            return;
        }

        try {
            const sellPayload = {
                id: rowData.ID,
                stoneid: rowData.STOCKID,
                weight: rowData.WEIGHT,
                party: formData.party,
                due: formData.DUE,
            };
            const insertResponse = await Axios.post(
                'http://localhost:5000/api/add-sell', // Your API route to insert
                sellPayload,
                { withCredentials: true }
            );
            console.log("Inserted into sell_data:", insertResponse.data);

            Axios.put(`http://localhost:5000/api/update-status/${rowData.ID}`, { party })
                .then((response) => {
                    console.log("Response from server:", response.data);
                    alert(response.data.message);
                    resetFormData();
                    fetchDiamondStock();
                })
                .catch((error) => {
                    console.error("Error updating status:", error);
                    alert("Failed to update status");
                });
        } catch (error) {
            console.error("Error in handleStatus:", error);
            alert("Failed to update status");
        }
    }

    const handleSell = async () => {
        console.log("Selling diamond with ID:", rowData.ID);

        try {
            // 1. Insert into sell_data
            const sellPayload = {
                id: rowData.ID,
                stoneid: rowData.STOCKID,
                weight: rowData.WEIGHT,
                party: rowData.PARTY,
                due: rowData.DUE,
            };
            const insertResponse = await Axios.post(
                'http://localhost:5000/api/add-sell', // Your API route to insert
                sellPayload,
                { withCredentials: true }
            );

            console.log("Inserted into sell_data:", insertResponse.data);

            Axios.delete(`http://localhost:5000/api/delete-stock/${rowData.ID}`)
                .then((response) => {
                    console.log("Response from server:", response.data);
                    alert(response.data.message);
                    resetFormData();
                    fetchDiamondStock(); // Refresh the stock data
                })
                .catch((error) => {
                    console.error("Error deleting stock:", error);
                    alert("Failed to delete stock");
                });
        } catch (error) {
            console.error("Error in handleSell:", error);
            alert("Failed to sell diamond / Delete stock");
        }
    }

    const handleRowClick = useCallback((row) => {
        console.log("Row clicked:", row);
        setRowData(row);
        setFormData({
            barcode: row.BARCODE || '',
            kapan: row.KAPAN || '',
            lot: row.PACKET || '',
            tag: row.TAG || '',
            certificate: row.CERTIFICATE_NUMBER || '',
            weight: row.WEIGHT || '',
            shape: row.SHAPE || 'RD',
            color: row.COLOR || 'D',
            clarity: row.CLARITY || 'IF',
            cut: row.CUT || 'EX',
            pol: row.POLISH || 'EX',
            sym: row.SYMMETRY || 'EX',
            length: row.LENGTH || '',
            width: row.WIDTH || '',
            price: row.PRICE_PER_CARAT || '',
            finalprice: row.FINAL_PRICE || '',
            party: row.PARTY || '',
            due: row.DUE || ''
        });
    }, []);

    const [filters, setFilters] = useState({
        color: '',
        clarity: '',
    });
    const [weightMin, setWeightMin] = useState(0);
    const [weightMax, setWeightMax] = useState(25);
    const [weightRange, setWeightRange] = useState([0, 25]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered results

    const handleSearch = () => {
        // const min = parseFloat(filters.weightMin) || 0;
        // const max = parseFloat(filters.weightMax) || 25;
        const min = weightMin;
        const max = weightMax;

        const result = stocks.filter((stock) => {
            const rawWeight = stock.WEIGHT?.toString().replace(',', '.').trim();
            const weight = parseFloat(rawWeight) || 0;
            const withinWeight = weight >= min && weight <= max;
            const matchesColor = !filters.color || stock.COLOR === filters.color;
            const matchesClarity = !filters.clarity || stock.CLARITY === filters.clarity;

            return withinWeight && matchesColor && matchesClarity;
        });

        setFilteredData(result);
    };





    return (
        <>
            <Box>
                <Box display="flex" justifyContent="flex-start" sx={{ mb: 2, gap: 2 }}>
                    <label htmlFor="import-excel">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            id="import-excel"
                            onChange={handleImportExcel}
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => document.getElementById('import-excel').click()}
                            style={{
                                backgroundColor: '#388e3c',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Import Excel
                        </button>
                    </label>

                    <Box display="flex" justifyContent="flex-end">
                        <button onClick={exportToExcel} style={{
                            margin: "0px",
                            backgroundColor: '#1976d2',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Export to Excel
                        </button>
                    </Box>
                    <button onClick={uploadData} disabled={stocks.length === 0}>Upload to DB</button>
                    <button type='button' onClick={fetchDiamondStock}>Show</button>
                    <button type='button' onClick={handleStatus} disabled={rowData.length === 0}>Hold</button>
                    <button type='button' onClick={handleSell} disabled={rowData.length === 0}>Sell</button>
                </Box>

                {/* Search */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,

                }}>
                    {/* Weight Slider */}
                    <Box sx={{ width: 200, ml: 3 }}>
                        <label style={{ fontWeight: 'bold' }}>Weight Range (ct):</label>
                        <Slider
                            value={weightRange}
                            onChange={(e, newValue) => {
                                setWeightRange(newValue);
                                setWeightMin(newValue[0]);
                                setWeightMax(newValue[1]);
                            }}
                            valueLabelDisplay="auto"
                            step={0.01}
                            min={0}
                            max={25}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <span>{weightRange[0]} ct</span>
                            <span>{weightRange[1]} ct</span>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}>
                        {/* <label style={{ fontWeight: 'bold' }}>Weight (ct):</label> */}
                        <Box display="flex" gap={1}>
                            <TextField
                                type="number"
                                label="Min"
                                size="small"
                                value={weightMin}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setWeightMin(value);
                                    setWeightRange([value, weightMax]);
                                }}
                            />
                            <TextField
                                type="number"
                                label="Max"
                                size="small"
                                value={weightMax}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setWeightMax(value);
                                    setWeightRange([weightMin, value]);
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Color Filter */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Color</InputLabel>
                        <Select
                            value={filters.color}
                            label="Color"
                            onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                        >
                            <MenuItem value="">All Colors</MenuItem>
                            {colorData.map((color) => (
                                <MenuItem key={color.CID} value={color.COLOR}>{color.COLOR}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Clarity Filter */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Clarity</InputLabel>
                        <Select
                            value={filters.clarity}
                            label="Clarity"
                            onChange={(e) => setFilters(prev => ({ ...prev, clarity: e.target.value }))}
                        >
                            <MenuItem value="">All Clarity</MenuItem>
                            {clarityData.map((clarity) => (
                                <MenuItem key={clarity.CID} value={clarity.CLARITY}>{clarity.CLARITY}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Search Button */}
                    <Button variant="contained" size="small" onClick={handleSearch}>
                        Apply Filters
                    </Button>
                    {/* Reset Button */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setFilters({ color: '', clarity: '' });
                            setWeightMin(0);
                            setWeightMax(25);
                            setWeightRange([0, 25]);
                            setFilteredData(stocks);
                        }}
                    >
                        Reset Filters
                    </Button>
                </Box>

                {/* form */}
                <form action="" onSubmit={handleSubmit}>
                    <table className={styles.inputTable}>
                        <thead>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name="barcode"
                                        placeholder='barcode'
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        ref={barcoderef}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="kapan"
                                        placeholder='kapan'
                                        value={formData.kapan}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="lot"
                                        placeholder='lot'
                                        value={formData.lot}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="tag"
                                        placeholder='tag'
                                        value={formData.tag}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="certificate"
                                        placeholder='certificate'
                                        value={formData.certificate}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="any"
                                        name="weight"
                                        placeholder='weight'
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <select name="shape" id="" value={formData.shape} onChange={handleChange}>
                                        {/* <option value="Shape">Shape</option> */}
                                        {
                                            shapeData.map((shape) => (
                                                <option key={shape.SID} value={shape.SHAPE}>
                                                    {shape.SHAPE}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="color" id="" value={formData.color} onChange={handleChange}>
                                        {/* <option value="Shape">Color</option> */}
                                        {
                                            colorData.map((color) => (
                                                <option key={color.CID} value={color.COLOR}>
                                                    {color.COLOR}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="clarity" id="" value={formData.clarity} onChange={handleChange}>
                                        {/* <option value="Shape">Clarity</option> */}
                                        {
                                            clarityData.map((clarity) => (
                                                <option key={clarity.CID} value={clarity.CLARITY}>
                                                    {clarity.CLARITY}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="cut" id="" value={formData.cut} onChange={handleChange}>
                                        {/* <option value="Shape">Cut</option> */}
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>
                                                    {cut.CUT}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="pol" id="" value={formData.pol} onChange={handleChange}>
                                        {/* <option value="Shape">Pol</option> */}
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>
                                                    {cut.CUT}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="sym" id="" value={formData.sym} onChange={handleChange}>
                                        {/* <option value="Shape">Sym</option> */}
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>
                                                    {cut.CUT}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="any"
                                        name="length"
                                        placeholder='length'
                                        value={formData.length}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="any"
                                        name="width"
                                        placeholder='width'
                                        value={formData.width}
                                        onChange={handleChange}
                                    />
                                </td>
                                {/* price per carat */}
                                {/* final price */}
                                {/* weight * price per carat = final price */}
                                <td>
                                    <input
                                        type="number"
                                        step="any"
                                        name="price"
                                        placeholder='price per carat'
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="any"
                                        name="finalprice"
                                        placeholder='final price'
                                        value={formData.finalprice}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="party"
                                        placeholder='party'
                                        value={formData.party}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="due"
                                        placeholder='due'
                                        value={formData.due}
                                        onChange={handleChange}
                                    />
                                </td>
                                <td style={{ display: 'none' }}>
                                    <input type="submit" />
                                </td>
                            </tr>
                        </thead>
                    </table>
                </form>

                {loading ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight="300px"
                        border="1px solid #ddd"
                        borderRadius={2}
                        p={4}
                        bgcolor="#f5f5f5"
                    >
                        <CircularProgress />
                        <Typography variant="body1" mt={2}>
                            Loading stock data...
                        </Typography>
                    </Box>
                ) : (
                    <StockTable
                        stocks={filteredData.length > 0 ? filteredData : stocks}
                        loading={loading}
                        onRowClick={handleRowClick}
                    />
                )}

                {error && (
                    <Box textAlign="center" mt={2} color="error.main">
                        {error}
                    </Box>
                )}

                {/* 
                <StockTable
                    stocks={filteredData.length > 0 ? filteredData : stocks}
                    loading={loading}
                    onRowClick={handleRowClick}
                /> */}

            </Box >
        </>
    )
}

export default StockData
