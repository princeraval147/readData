import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './StockData.module.css';

const StockData = () => {

    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    useEffect(() => {
        // const token = localStorage.getItem('token');
        function getTokenFromCookie() {
            const cookie = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="));
            return cookie ? cookie.split("=")[1] : null;
        }
        const token = getTokenFromCookie();
        // console.log("Sending token:", token);
        Axios.get('http://localhost:5000/api/get-diamondstock', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setStocks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching stock:", error);

                if (error.response && error.response.status === 401) {
                    alert("You are not authorized. Please log in.");
                    // Optionally redirect to login:
                    navigate('/login');
                }
            });
    }, []);

    // Loading
    // if (stocks.length === 0) return <div className={styles.loadingOverlay}>
    //     <CircularProgress size={60} color="primary" />
    // </div>

    // const headers = Object.keys(stocks[0] || {});
    const headers = stocks.length > 0 ? Object.keys(stocks[0]) : [];

    // Pagination logic
    const totalPages = Math.ceil(stocks.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = stocks.slice(startIndex, startIndex + rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };


    // Design the table
    const StyledTableCell = styled(TableCell)({
        position: 'sticky',
        top: 0,
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
        zIndex: 1,
    });
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    }));

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
    };

    function normalizeKey(header) {
        const cleanedKey = header
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric (e.g., #, %, @)
            .toUpperCase();
        return headerMapping[cleanedKey] || cleanedKey;
    }

    function convertToObjects(rows) {
        if (!Array.isArray(rows) || rows.length < 2 || !Array.isArray(rows[0])) {
            console.warn("Invalid rows format:", rows[0]);
            return [];
        }

        const headers = rows[0].map(normalizeKey);
        const dataRows = rows.slice(1);

        return dataRows.map((row) => {
            const obj = {};
            headers.forEach((key, index) => {
                if (key && key.trim() !== '') {
                    obj[key] = row[index] !== undefined ? row[index] : '';
                }
            });
            return obj;
        });
    }

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
                </Box>

                <TableContainer component={Paper} sx={{ maxHeight: 480, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headers.map((header, i) => (
                                    <StyledTableCell
                                        key={i}
                                    >
                                        {header}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {headers.map((header, colIndex) => (
                                        <TableCell key={colIndex}>{row[header]}</TableCell>
                                    ))}
                                    {/* {stocks.map((stock, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{stock.STOCK}</td>
                                            <td>{stock.KAPAN}</td>
                                            <td>{stock.PACKET}</td>
                                            <td>{stock.TAG}</td>
                                            <td>{stock.STOCKID}</td>
                                            <td>{stock.AVAILABILITY}</td>
                                            <td>{stock.STATUS}</td>
                                            <td>{stock.WEIGHT}</td>
                                            <td>{stock.COLOR}</td>
                                            <td>{stock.CLARITY}</td>
                                            <td>{stock.CUT}</td>
                                            <td>{stock.POLISH}</td>
                                            <td>{stock.SYMMENTRY}</td>
                                            <td>{stock.FLUOESCENCE_INTENSITY}</td>
                                            <td>{stock.LENGTH}</td>
                                            <td>{stock.WIDTH}</td>
                                            <td>{stock.HEIGHT}</td>
                                            <td>{stock.SHADE}</td>
                                            <td>{stock.MILKY}</td>
                                            <td>{stock.EYE_CLEAN}</td>
                                            <td>{stock.LAB}</td>
                                            <td>{stock.CERTIFICATE_COMMENT}</td>
                                            <td>{stock.REPORT_NO}</td>
                                            <td>{stock.LOCATION}</td>
                                            <td>{stock.STATE}</td>
                                            <td>{stock.COUNTRY}</td>
                                            <td>{stock.TREATMENT}</td>
                                            <td>{stock.DEPTH_PERCENTAGE}</td>
                                            <td>{stock.TABLE_PERCENTAGE}</td>
                                            <td>{stock.DIAMOND_VIDEO}</td>
                                            <td>{stock.DIAMOND_IMAGE}</td>
                                            <td>{stock.RAP_PER_CARAT}</td>
                                            <td>{stock.PRICE_PER_CARAT}</td>
                                            <td>{stock.RAP_PRICE}</td>
                                            <td>{stock.DISCOUNT}</td>
                                            <td>{stock.FINAL_PRICE}</td>
                                            <td>{stock.HEART_ARROW}</td>
                                            <td>{stock.STAR_LENGTH}</td>
                                            <td>{stock.LASER_DESCRIPTION}</td>
                                            <td>{stock.GROWTH_TYPE}</td>
                                            <td>{stock.KEY_TO_SYMBOL}</td>
                                            <td>{stock.LW_RATIO}</td>
                                            <td>{stock.CULET_SIZE}</td>
                                            <td>{stock.CULET_CONDITION}</td>
                                        </tr>
                                    ))} */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* MUI Pagination */}
                <Box display="flex" justifyContent="center" mt={1}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handleChangePage}
                        color="primary"
                        size="large"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </Box>
            </Box>
        </>
    )
}

export default StockData
