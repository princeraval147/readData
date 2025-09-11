import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './StockData.module.css';
import StockTable from './StockTable';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, TextField, Stack, Autocomplete, Chip, Snackbar, Alert } from '@mui/material';
import { UploadFile, SaveAlt, CloudUpload, Visibility, Pause, ShoppingCart, CheckCircle, Newspaper } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import API from '../../API';
import { useNotification } from '../../context/NotificationContext';

const StockData = () => {

    const { showMessage } = useNotification();

    const [formData, setFormData] = useState({
        stockId: '',
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
        category: ''
    });

    const resetFormData = () => {
        setFormData({
            stockId: '',
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
            category: ''
        });
    }

    const barcoderef = useRef(null);
    const stockIdRef = useRef(null);
    // const partyRef = useRef(null);
    const priceRef = useRef(null);
    const finalPriceRef = useRef(null);
    const partyRef = useRef(null);

    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);
    const fetchDiamondStock = async () => {
        setLoading(true);
        setStocks([]);
        setError(null); // reset previous error

        try {
            const response = await API.get("/get-diamondstock", {
                withCredentials: true, // ✅ Sends cookies
            });
            const data = response.data;
            if (Array.isArray(data) && data.length === 0) {
                setError("Stock not available.");
                return;
            }
            setStocks(data);
        } catch (error) {
            console.error("Error fetching stock:", error);
            if (error.response?.status === 401) {
                // alert("You are not authorized. Please log in.");
                showMessage("You are not authorized. Please log in.", "error");
                navigate('/login');
            } else {
                setError("Failed to fetch stock data. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }

    // handle excel data 
    const [excelData, setExcelData] = useState([]);

    function parseMeasurements(measurementStr) {
        let length = null, width = null, height = null;

        if (measurementStr.includes("*")) {
            // Example: "5.29-5.34*3.33"
            const [lw, h] = measurementStr.split("*");

            height = parseFloat(h);

            if (lw.includes("-")) {
                const [l, w] = lw.split("-");
                length = parseFloat(l);
                width = parseFloat(w);
            } else {
                // Case: "5.29*3.33" (no dash, only length & height)
                length = parseFloat(lw);
                width = parseFloat(lw);
            }
        }

        return { LENGTH: length, WIDTH: width, HEIGHT: height };
    }

    // Example usage:
    // const measurement = "5.29-5.34*3.33";
    // const { LENGTH, WIDTH, HEIGHT } = parseMeasurements(measurement);

    // console.log("Length:", LENGTH); // 5.29
    // console.log("Width:", WIDTH);   // 5.34
    // console.log("Height:", HEIGHT); // 3.33

    const headerMapping = {
        'STOCK_': 'STOCKID',
        'STOCK': 'STOCKID',
        'CUSTOMER_REF_NO': 'STOCKID',
        'REPORT_': 'CERTIFICATE_NUMBER',
        'TABLE_': 'TABLE_PERCENT',
        'DEPTH_': 'DEPTH_PERCENT',
        'PRICE_PER_CARAT': 'PRICE_PER_CARAT',
        'PRICE': 'PRICE_PER_CARAT',
        'TOTAL_PRICE': 'FINAL_PRICE',
        'EYE_CLEAN': 'EYE_CLEAN',
        'FLUORESCENCE_INTENSITY': 'FLUORESCENCE',
        'DIAMOND_VIDEO': 'DIAMOND_VIDEO',
        'VIDEO_LINK': 'DIAMOND_VIDEO',
        'DIAMOND_IMAGE': 'DIAMOND_IMAGE',
        'IMAGE_LINK': 'DIAMOND_IMAGE',
        'IMAGE_LINK_2': 'DIAMOND_IMAGE',
        'IMAGE_LINK_3': 'DIAMOND_IMAGE',
        'IMAGE_LINK_4': 'DIAMOND_IMAGE',
        'IMAGE_LINK_5': 'DIAMOND_IMAGE',
        'IMAGE_LINK_6': 'DIAMOND_IMAGE',
        'CERTIFICATE_URL': 'CERTIFICATE_IMAGE',
        'CERT_COMMENT': 'CERTIFICATE_COMMENT',
        'TREATMENT': 'GROWTH_TYPE',
        'GROWTH_TYPE': 'GROWTH_TYPE',
        'FANCY_COLOR': 'FANCY_COLOR',
        'FANCY_COLOR_INTENSITY': 'FANCY_COLOR_INTENSITY',
        // Measurement1	Measurement2	Measurement3
        'MEASUREMENT': 'MEASUREMENT',
        'MEASUREMENT1': 'LENGTH',
        'MEASUREMENT2': 'WIDTH',
        'MEASUREMENT3': 'HEIGHT',
        'MEASUREMENTS_LENGTH': 'LENGTH',
        'MEASUREMENTS_WIDTH': 'WIDTH',
        'MEASUREMENTS_DEPTH': 'HEIGHT',
        'TABLE': 'TABLE_PERCENT',
        'DEPTH': 'DEPTH_PERCENT',
        'SYM': 'SYMMETRY',
        'REPORT_NUMBER': 'CERTIFICATE_NUMBER',
        'CULET_SIZE': 'CULET_SIZE',
        'GIRDLE_NAME': 'GIRDLE_CONDITION',
        'GIRDLE_PERCENT': 'GIRDLE_PER',
        'PAVILION_DEPTH': 'PAVILLION_DEPTH',
        'POL_OR_POLSYM': 'POLISH',
        'SHAPE_NAME': 'SHAPE',
        'COLOR_LONG': 'COLOR',
        'CUTDROP': 'CUT',
        'DOCUMENT_NO': 'CERTIFICATE_NUMBER',
        'CERTIFICATE_': 'CERTIFICATE_NUMBER',
        'REPORT_NO': 'CERTIFICATE_NUMBER',
        'Location': 'CITY',
        'location': 'CITY',
        'LOCATION': 'CITY',
        'COP': 'COUNTRY'
    };

    const validateExcelHeaders = (sheet) => {
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!jsonData.length) return false;

        const actualHeaders = Object.keys(jsonData[0])
            .map(h => h.trim().toLowerCase());

        const expectedHeaders = ['weight', 'clarity'];

        return expectedHeaders.every(header => actualHeaders.includes(header));
    };

    //  
    // Working import file excel
    const handleImportExcel = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // ✅ Validate headers
            if (!validateExcelHeaders(worksheet)) {
                setLoading(false);
                setError("Invalid Excel format.");
                console.log("Invalid Excel format. Expected columns: Weight, Clarity");
                setExcelData([]);
                return;
            }

            // ✅ Parse if valid
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            setLoading(false);
            setError(null);
            setExcelData(jsonData); // ✅ Store in separate state
        };

        if (file) reader.readAsArrayBuffer(file);
    };


    // export to excel
    const [tableExportData, setTableExportData] = useState({ headers: [], rows: [] });
    const exportToExcel = () => {
        const fallbackHeaders = [
            "KAPAN", "PACKET", "TAG", "STOCKID", "WEIGHT",
            "SHAPE", "COLOR", "CLARITY", "CUT", "POLISH", "SYMMETRY", "FLUORESCENCE",
            "LENGTH", "WIDTH", "HEIGHT", "SHADE", "MILKY", "EYE_CLEAN",
            "LAB", "CERTIFICATE_COMMENT", "CITY", "STATE", "COUNTRY",
            "DEPTH_PERCENT", "TABLE_PERCENT", "DIAMOND_VIDEO", "DIAMOND_IMAGE",
            "RAP_PER_CARAT", "PRICE_PER_CARAT", "RAP_PRICE", "DOLLAR_RATE", "RS_AMOUNT", "DISCOUNT", "FINAL_PRICE",
            "GROWTH_TYPE", "LW_RATIO", "CULET_SIZE", "CERTIFICATE_IMAGE", "STATUS", "DIAMOND_TYPE", "IS_ACTIVE",
            "BGM", "NO_BGM", "CERTIFICATE_NUMBER", "PARTY", "DUE"
        ];

        const { headers, rows } = tableExportData;

        const usedHeaders = headers.length > 0 ? headers : fallbackHeaders;

        const exportData = rows.length > 0
            ? rows
            : [Object.fromEntries(usedHeaders.map(h => [h, ""]))];

        // console.log("Exported Excel data = ", exportData);

        const worksheet = XLSX.utils.json_to_sheet(exportData, { header: usedHeaders });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "StockData");

        XLSX.writeFile(workbook, "diamond_stock.xlsx");
    };



    // Send to DB
    // function normalizeObjectKeys(data) {
    //     return data.map(obj => {
    //         const normalized = {};
    //         Object.entries(obj).forEach(([key, value]) => {
    //             const cleanedKey = key
    //                 .trim()
    //                 .replace(/\s+/g, '_')
    //                 .replace(/[^a-zA-Z0-9_]/g, '')
    //                 .toUpperCase();
    //             const dbKey = headerMapping[cleanedKey] || cleanedKey;
    //             if (dbKey === 'AVAILABILITY') {
    //                 const availability = (value || '').toString().trim().toUpperCase();
    //                 if (availability === 'YES' || availability === 'G') normalized['STATUS'] = 'AVAILABLE';
    //                 else if (availability === 'SOLD') normalized['STATUS'] = 'SOLD';
    //                 else if (availability === 'HOLD') normalized['STATUS'] = 'HOLD';
    //             }
    //             normalized[dbKey] = value ?? '';
    //         });
    //         return normalized;
    //     });
    // }
    function normalizeObjectKeys(data) {
        return data.map(obj => {
            const normalized = {};
            let tempCity = '';
            let tempLocation = '';

            Object.entries(obj).forEach(([key, value]) => {
                const cleanedKey = key
                    .trim()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9_]/g, '')
                    .toUpperCase();

                const dbKey = headerMapping[cleanedKey] || cleanedKey;
                const cleanedValue = value ?? '';

                // ✅ Special case: MEASUREMENTS → split into LENGTH, WIDTH, HEIGHT
                if (dbKey === 'MEASUREMENT') {
                    const { LENGTH, WIDTH, HEIGHT } = parseMeasurements(cleanedValue);
                    if (LENGTH) normalized['LENGTH'] = LENGTH;
                    if (WIDTH) normalized['WIDTH'] = WIDTH;
                    if (HEIGHT) normalized['HEIGHT'] = HEIGHT;
                    return; // skip adding MEASUREMENTS itself
                }

                // Handle AVAILABILITY -> STATUS
                if (dbKey === 'AVAILABILITY') {
                    const availability = (cleanedValue || '').toString().trim().toUpperCase();
                    if (availability === 'YES' || availability === 'G') {
                        normalized['STATUS'] = 'AVAILABLE';
                    } else if (availability === 'SOLD') {
                        normalized['STATUS'] = 'SOLD';
                    } else if (availability === 'HOLD') {
                        normalized['STATUS'] = 'HOLD';
                    }
                }

                // Temporarily collect both LOCATION and CITY values
                if (cleanedKey === 'LOCATION') {
                    tempLocation = cleanedValue;
                    return; // Skip adding now
                }

                if (cleanedKey === 'CITY') {
                    tempCity = cleanedValue;
                    return; // Skip adding now
                }

                normalized[dbKey] = cleanedValue;
            });

            // Resolve CITY vs LOCATION
            normalized['CITY'] = tempCity || tempLocation || '';

            return normalized;
        });
    }

    const uploadData = async () => {
        if (!Array.isArray(excelData) || excelData.length === 0) {
            // alert("Invalid or empty data");
            showMessage("Invalid or empty data");
            return;
        }
        const sendToDB = {
            data: normalizeObjectKeys(excelData),
            category: formData.category
        };
        console.log("Send to DB = ", sendToDB);
        setLoading(true); // Start loading
        try {
            const res = await API.post('/upload-excel', sendToDB, { withCredentials: true });
            // alert(res.data.message);
            showMessage(res.data.message, "success");
            setExcelData([]);
            setStocks([]);
            resetFormData();
        } catch (error) {
            console.error("Internal Error:", error);
            // alert("Upload failed");
            showMessage("Upload failed", "error");
        } finally {
            setLoading(false);  // Stop loading
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
                endpoints.map(endpoint => API.get(`/${endpoint}`))
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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value.toUpperCase(),
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: value.toUpperCase(),
            };

            const weight = parseFloat(updated.weight) || 0;
            const price = parseFloat(updated.price) || 0;
            const finalPrice = price * weight;

            return {
                ...updated,
                finalprice: finalPrice.toFixed(2),
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/add-diamondstock', formData, {
                withCredentials: true
            });

            // alert("Data inserted Successfully");
            showMessage("Data inserted Successfully", "success");
            resetFilter();        // Reset filters and fetch updated stock
            resetFormData();      // Clear form fields

            setTimeout(() => {
                barcoderef.current.focus();
            }, 100);


        } catch (error) {
            console.error("Error submitting form:", error);
            // alert("Failed to submit data");
            showMessage("Failed to submit data", "error");
        }
    }

    const [rowData, setRowData] = useState([]);
    const handleStatus = async () => {

        const isHolding = rowData.STATUS === 'HOLD';
        const newStatus = isHolding ? 'AVAILABLE' : 'HOLD';

        try {
            if (!isHolding) {
                if (formData.party === '' || !formData.party) {
                    // alert("Please enter party name before Update Status.");
                    showMessage("Please enter party name before Update Status.");
                    setTimeout(() => {
                        partyRef.current.focus();
                    }, 100);
                    return;
                }
                // If converting to HOLD, add a sell record
                const sellPayload = {
                    id: rowData.ID,
                    stoneid: rowData.STOCKID,
                    weight: rowData.WEIGHT,
                    price: formData.price,
                    finalprice: formData.finalprice,
                    drate: formData.drate,
                    amountRs: formData.amountRs,
                    status: newStatus,
                    party: formData.party,
                    // due: formData.due,
                };
                await API.post('/add-sell', sellPayload, { withCredentials: true });
            }

            await API.put(`/update-status/${rowData.ID}`, { status: newStatus });
            setRowData([]);
            resetFormData();
            // update temprory insted fetchDiamondStock
            setStocks(prev =>
                prev.map(stock =>
                    stock.ID === rowData.ID ? { ...stock, STATUS: newStatus } : stock
                )
            );
            // alert(`Status updated to ${newStatus}.`);
            showMessage(`Status updated to ${newStatus}.`, "success");
        } catch (error) {
            console.error("Error in handleStatus:", error);
            // alert("Failed to update status");
            showMessage("Failed to update status", "error");
        }
    }

    const handleSell = async () => {
        // setLoading(true); // Start loading
        setUpdating(true); // Start loading
        try {
            if (formData.party === '' || !formData.party) {
                // alert("Please enter party name before sell.");
                showMessage("Please enter party name before sell.");
                setTimeout(() => {
                    partyRef.current.focus();
                }, 100);
                return;
            }
            // 1. Insert into sell_data
            const sellPayload = {
                id: rowData.ID,
                stoneid: rowData.STOCKID,
                weight: rowData.WEIGHT,
                price: formData.price,
                finalprice: formData.finalprice,
                drate: formData.drate,
                amountRs: formData.amountRs,
                status: "SOLD",
                party: formData.party,
                // due: formData.due,
            };
            await API.post('/add-sell', sellPayload, { withCredentials: true });
            let deleteResponse = null;
            try {
                deleteResponse = await API.delete(`/delete-stock/${rowData.ID}`);

                if (deleteResponse?.data?.message) {
                    // alert(deleteResponse.data.message);
                    showMessage(deleteResponse.data.message, "success");
                }
                setRowData([]);
                resetFormData();
                try {
                    await fetchDiamondStock();
                } catch (err) {
                    console.error("Error in fetchDiamondStock:", err);
                }
            } catch (deleteError) {
                console.error("DELETE failed:", deleteError);
                // alert("Failed to delete stock: " + (deleteError?.response?.data?.error || deleteError.message));
                showMessage("Failed to delete stock: " + (deleteError?.response?.data?.error || deleteError.message), "error");
            }
        } catch (error) {
            console.error("Error in handleSell:", error);
            // alert("Failed to sell diamond / Delete stock");
            showMessage("Failed to sell diamond / Delete stock", "error");
        } finally {
            // setLoading(false);
            setUpdating(false);
        }
    }

    const handleRowClick = useCallback((row) => {
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
            drate: row.DOLLAR_RATE || '0',
            price: row.PRICE_PER_CARAT || '0',
            finalprice: row.FINAL_PRICE || '0',
            // due: row.DUE || ''
        });
    }, []);


    // Search Filter
    const [filters, setFilters] = useState({
        shape: '',
        color: '',
        clarity: '',
        stockID: '',
        certificate: ''
    });
    const [weightMin, setWeightMin] = useState(0);
    const [weightMax, setWeightMax] = useState(25);
    const [weightRange, setWeightRange] = useState([0, 25]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered results
    const normalizeShape = (shape) => {
        const cleaned = shape?.toUpperCase().trim();
        const map = {
            RD: "RD", ROUND: "RD", round: "RD",
            PR: "PR", PEAR: "PR", pear: "PR",
            PN: "PN", PRINCESS: "PN", princess: "PN",
            CU: "CU", CUSHION: "CU", cushion: "CU",
            EM: "EM", EMERALD: "EM", emerald: "EM",
            MQ: "MQ", MARQUISE: "MQ", marquise: "MQ",
            HT: "HT", HEART: "HT", heart: "HT",
            OV: "OV", OVAL: "OV", oval: "OV",
            RAD: "RAD", RADIANT: "RAD", radiant: "RAD",
            TRE: "TRE", TRILLIANT: "TRE", trilliant: "TRE",
        };
        return map[cleaned] || cleaned;
    };

    // Matching result alert msg
    const [open, setOpen] = useState(false);
    const handleAlertClick = () => {
        setOpen(true); // show the snackbar
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const handleSearch = () => {
        setError(null);
        // const min = parseFloat(filters.weightMin) || 0;
        // const max = parseFloat(filters.weightMax) || 25;
        const min = weightMin;
        const max = weightMax;
        const normalize = str => str?.toLowerCase().replace(/\s+/g, '') || '';  // Reomve space (eg: VS 1 - VS1)

        const result = stocks.filter((stock) => {
            const rawWeight = stock.WEIGHT?.toString().replace(',', '.').trim();
            const weight = parseFloat(rawWeight) || 0;
            const withinWeight = weight >= min && weight <= max;


            // Raval
            const matchesStockID =
                !filters.stockID ||
                stock.STOCKID?.toLowerCase().includes(filters.stockID.toLowerCase());


            const matchesCertificate =
                !filters.certificate ||
                stock.CERTIFICATE_NUMBER?.toLowerCase().includes(filters.certificate.toLowerCase());
            const matchesColor = !filters.color || stock.COLOR === filters.color;
            const matchesClarity = !filters.clarity || normalize(stock.CLARITY) === normalize(filters.clarity);
            // const matchesShape = !filters.shape || getShapeKey(stock.SHAPE) === getShapeKey(filters.shape);
            // const shapeValue = shapeMap[filters.shape] || filters.shape;
            // const matchesShape = !filters.shape || stock.SHAPE === shapeValue;
            const matchesShape = !filters.shape || normalizeShape(stock.SHAPE) === normalizeShape(filters.shape);


            return withinWeight && matchesStockID && matchesCertificate && matchesColor && matchesClarity && matchesShape;
        });
        console.log("Stock id = ", filters.stockID);


        if (filters.shape || filters.color || filters.clarity || filters.stockID || filters.certificate || weightMin !== 0 || weightMax !== 25) {
            // Only show error if filters are applied
            if (result.length === 0) {
                // raval
                setOpen(true);
                setError("No matching results found.");
            }
        }

        setFilteredData(result);
    };

    const resetFilter = async () => {
        setFilters({ color: '', clarity: '', shape: '', stockID: '', certificate: '' });
        setWeightMin(0);
        setWeightMax(25);
        setWeightRange([0, 25]);
        setFilteredData([]);
        setError(null);
    }

    // use enter key as tab
    const handleEnterAsTab = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stop form submission
            const form = e.target.form;
            const elements = Array.from(form.elements).filter(el => el.tagName === 'INPUT' || el.tagName === 'SELECT');
            const index = elements.indexOf(e.target);
            if (index > -1 && index < elements.length - 1) {
                elements[index + 1].focus();
            }
        }
    };

    const stockIdOptions = [...new Set(stocks.map(stock => stock.STOCKID).filter(Boolean))];
    // const certificateOptions = [...new Set(stocks.map(stock => stock.CERTIFICATE_NUMBER).filter(Boolean))];
    const certificateOptions = useMemo(() => {
        return [...new Set(stocks.map(stock => stock.CERTIFICATE_NUMBER).filter(Boolean))];
    }, [stocks]);

    const deleteStock = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this?");
        if (confirmed) {
            try {
                const deleteResponse = await API.delete(`/delete-all-stock`, { withCredentials: true });

                if (deleteResponse?.data?.message) {
                    // alert(deleteResponse.data.message);
                    showMessage(deleteResponse.data.message, "success");
                }
                try {
                    await fetchDiamondStock();
                } catch (err) {
                    console.error("Error in fetchDiamondStock:", err);
                }
            } catch (deleteError) {
                console.error("All DELETE failed:", deleteError);
                // alert("Failed to delete All stock: ");
                showMessage("Failed to delete All stock: ", "error");
            }
        }
    }






    return (
        <>
            <Box>
                <Box mb={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                        <label htmlFor="import-excel">
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                id="import-excel"
                                onChange={handleImportExcel}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<UploadFile />}
                                sx={{ backgroundColor: '#388e3c' }}
                            // onClick={() => document.getElementById('import-excel').click()}
                            >
                                Import Excel
                            </Button>
                        </label>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveAlt />}
                            onClick={exportToExcel}
                        >
                            Export to Excel
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CloudUpload />}
                            onClick={uploadData}
                            disabled={excelData.length === 0}
                        >
                            Upload to Stock
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Visibility />}
                            onClick={fetchDiamondStock}
                        >
                            Show
                        </Button>

                        <Button
                            variant="contained"
                            // color="warning"
                            // startIcon={<Pause />}
                            color={rowData.STATUS === 'HOLD' ? 'success' : 'warning'}
                            startIcon={rowData.STATUS === 'HOLD' ? <CheckCircle /> : <Pause />}
                            onClick={handleStatus}
                            disabled={rowData.length === 0}
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

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForeverIcon />}
                            onClick={deleteStock}
                            disabled={stocks.length === 0}
                        >
                            Delete All Stock
                        </Button>
                        {/* Result msg */}
                        {filteredData.length > 0 && (
                            <Chip
                                className='flex flex-end'
                                label={`Found ${filteredData.length} result${filteredData.length > 1 ? 's' : ''}`}
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 2, ml: 2 }}
                            />
                        )}
                    </Stack>
                </Box>

                {/* Alert */}
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleClose} severity="default" variant="filled" sx={{ width: '100%' }}>
                        No matching results found.
                    </Alert>
                </Snackbar>



                {/* Search */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: { xs: 'stretch', md: 'center' },
                    // alignItems: 'center',
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
                                sx={{ width: "90px" }}
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
                                sx={{ width: "90px" }}
                                value={weightMax}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setWeightMax(value);
                                    setWeightRange([weightMin, value]);
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Stockid filter */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            size="small"
                            options={stockIdOptions}
                            getOptionLabel={(option) => option || ""}
                            value={filters.stockID}
                            onChange={(e, newValue) =>
                                setFilters((prev) => ({ ...prev, stockID: newValue || '' }))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Stock Id" />
                            )}
                            sx={{ width: 200 }}
                        />
                    </Box>

                    {/* Certificate Filter */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Autocomplete
                            size="small"
                            options={certificateOptions}
                            getOptionLabel={(option) => option || ""}
                            value={filters.certificate}
                            onChange={(e, newValue) =>
                                setFilters((prev) => ({ ...prev, certificate: newValue || '' }))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Certificate" />
                            )}
                            sx={{ width: 200 }}
                        />
                    </Box>

                    {/* Shape Filter */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Shape</InputLabel>
                        <Select
                            value={filters.shape}
                            label="shape"
                            onChange={(e) => setFilters(prev => ({ ...prev, shape: e.target.value }))}
                        >
                            <MenuItem value="">All Shape</MenuItem>
                            {shapeData.map((shape) => (
                                <MenuItem key={shape.SID} value={shape.SHAPE}>{shape.SHAPE}</MenuItem>
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
                    {/* Reset filter */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={resetFilter}
                    >
                        Reset Filters
                    </Button>
                </Box>

                {/* form */}
                <div>
                    <form action="" onSubmit={handleSubmit}>
                        <table className={styles.inputTable}>
                            <thead>
                                <tr>
                                    <th>Stock Id</th>
                                    <th>Certificate</th>
                                    <th>Weight</th>
                                    <th>Shape</th>
                                    <th>Color</th>
                                    <th>Clarity</th>
                                    <th>Cut</th>
                                    <th>Pol</th>
                                    <th>Sym</th>
                                    <th>Length</th>
                                    <th>Width</th>
                                    <th>Price Per Carat</th>
                                    <th>Final Price</th>
                                    <th>Party</th>
                                    <th>Category</th>
                                </tr>
                                <tr>
                                    <td>
                                        <input
                                            onKeyDown={handleEnterAsTab}
                                            type="text"
                                            name="stockId"
                                            placeholder='Stock Id'
                                            value={formData.stockId}
                                            onChange={handleChange}
                                            ref={stockIdRef}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            onKeyDown={handleEnterAsTab}
                                            type="text"
                                            name="certificate"
                                            placeholder='certificate'
                                            value={formData.certificate}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            onKeyDown={handleEnterAsTab}
                                            type="number"
                                            step="any"
                                            name="weight"
                                            placeholder='weight'
                                            value={formData.weight}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <select name="shape" id="" value={formData.shape} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                        <select name="color" id="" value={formData.color} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                        <select name="clarity" id="" value={formData.clarity} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                        <select name="cut" id="" value={formData.cut} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                        <select name="pol" id="" value={formData.pol} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                        <select name="sym" id="" value={formData.sym} onChange={handleChange} onKeyDown={handleEnterAsTab}>
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
                                            onKeyDown={handleEnterAsTab}
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
                                            onKeyDown={handleEnterAsTab}
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
                                            onKeyDown={handleEnterAsTab}
                                            type="number"
                                            step="any"
                                            name="price"
                                            placeholder='price per carat'
                                            value={formData.price}
                                            onChange={handleChange}
                                            ref={priceRef}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            onKeyDown={handleEnterAsTab}
                                            type="number"
                                            step="any"
                                            name="finalprice"
                                            placeholder='final price'
                                            value={formData.finalprice}
                                            onChange={handleChange}
                                            ref={finalPriceRef}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="party"
                                            placeholder='Party'
                                            value={formData.party}
                                            onChange={handleChange}
                                            ref={partyRef}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="category"
                                            placeholder='Category'
                                            value={formData.category}
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
                </div>

                {
                    loading ? (
                        <Box className={styles.loadingOverlay}>
                            <CircularProgress />
                            <Typography variant="body1" mt={2}>Loading...</Typography>
                        </Box>
                    ) : error ? (
                        <Box textAlign="center" mt={2} color="error.main">
                            {error}
                        </Box>
                    ) : (
                        <StockTable
                            // stocks={filteredData.length > 0 ? filteredData : stocks}
                            stocks={excelData.length > 0 ? excelData : (filteredData.length > 0 ? filteredData : stocks)}
                            showAllColumns={excelData.length > 0}
                            loading={loading}
                            onRowClick={handleRowClick}
                            onProcessedData={setTableExportData}
                        />
                    )
                }
            </Box >
        </>
    )
}

export default StockData
