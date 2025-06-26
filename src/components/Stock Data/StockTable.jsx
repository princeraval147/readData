import React, { useState, useMemo, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, Box
} from '@mui/material';


const StockTable = React.memo(({ stocks, onRowClick, showAllColumns = false, onProcessedData }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    const headersToShow = [
        "STOCKID", "WEIGHT", "FANCY_COLOR", "FANCY_COLOR_INTENSITY",
        "SHAPE", "COLOR", "CLARITY", "CUT", "POLISH", "SYMMETRY", "FLUORESCENCE",
        "LENGTH", "WIDTH", "HEIGHT", "SHADE", "MILKY", "EYE_CLEAN", "LAB", "CERTIFICATE_NUMBER", "CERTIFICATE_COMMENT",
        "CITY", "STATE", "COUNTRY", "DEPTH_PERCENT", "TABLE_PERCENT", "DIAMOND_VIDEO", "DIAMOND_IMAGE",
        "RAP_PER_CARAT", "PRICE_PER_CARAT", "RAP_PRICE", "DISCOUNT", "FINAL_PRICE",
        "GROWTH_TYPE", "LW_RATIO", "CULET_SIZE", "CERTIFICATE_IMAGE", "STATUS", "DIAMOND_TYPE", "IS_ACTIVE",
        "BGM", "NO_BGM"
    ];

    const allHeaders = stocks.length > 0 ? Object.keys(stocks[0]) : [];
    const headers = showAllColumns ? allHeaders : allHeaders.filter(h => headersToShow.includes(h));

    // const headers = stocks.length > 0 ? Object.keys(stocks[0]) : [];
    // Try This for UX
    // const displayHeaders = [
    //     { label: "Price Per Carat", key: "price" },
    //     { label: "Final Price", key: "finalprice" },
    // ];
    // displayHeaders.map(({ label, key }) => (
    //     <TableCell key={key}>{row[key]}</TableCell>
    // ));


    // Pagination calculations
    const totalPages = Math.ceil(stocks.length / rowsPerPage);

    // Memoize paginated data to avoid recalculating on unrelated state changes
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return stocks.slice(startIndex, startIndex + rowsPerPage);
    }, [stocks, currentPage]);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };


    useEffect(() => {
        const fallbackHeaders = [
            "STOCKID", "WEIGHT", "FANCY_COLOR", "FANCY_COLOR_INTENSITY",
            "SHAPE", "COLOR", "CLARITY", "CUT", "POLISH", "SYMMETRY", "FLUORESCENCE",
            "LENGTH", "WIDTH", "HEIGHT", "SHADE", "MILKY", "EYE_CLEAN", "LAB", "CERTIFICATE_NUMBER", "CERTIFICATE_COMMENT",
            "CITY", "STATE", "COUNTRY", "DEPTH_PERCENT", "TABLE_PERCENT", "DIAMOND_VIDEO", "DIAMOND_IMAGE",
            "RAP_PER_CARAT", "PRICE_PER_CARAT", "RAP_PRICE", "DISCOUNT", "FINAL_PRICE",
            "GROWTH_TYPE", "LW_RATIO", "CULET_SIZE", "CERTIFICATE_IMAGE", "STATUS", "DIAMOND_TYPE", "IS_ACTIVE",
            "BGM", "NO_BGM"
        ];


        if (onProcessedData) {
            if (stocks.length === 0) {
                // Send only fallback headers and empty row
                onProcessedData({
                    headers: fallbackHeaders,
                    rows: []
                });
            } else {
                const exportHeaders = ["ID", ...(headers.length > 0 ? headers : fallbackHeaders)];
                // const exportHeaders = headers.length > 0 ? headers : fallbackHeaders;
                const processed = stocks.map((row, index) => {
                    const rowData = { ID: index + 1 }; // Add ID manually
                    exportHeaders.forEach(h => {
                        if (h !== "ID") {
                            rowData[h] = row[h] ?? "";
                        }
                    });
                    return rowData;
                });

                // const processed = stocks.map((row, index) => {
                //     const rowData = {};
                //     exportHeaders.forEach(h => {
                //         rowData[h] = row[h] ?? "";
                //     });
                //     return rowData;
                // });
                onProcessedData({
                    headers: exportHeaders,
                    rows: processed
                });
            }
        }
    }, [stocks, headers, onProcessedData]);







    return (
        <>
            {
                stocks.length !== 0 &&
                (
                    <>
                        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            position: 'sticky',
                                            top: 0,
                                            background: '#f0f0f0',
                                            zIndex: 1
                                        }}>
                                        <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', }}>ID</TableCell>
                                        {headers.map((header, i) => (
                                            <>
                                                <TableCell
                                                    key={i}
                                                    sx={{
                                                        backgroundColor: '#f0f0f0',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {header}
                                                </TableCell>
                                            </>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((row, rowIndex) => (
                                        <TableRow
                                            key={rowIndex}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onRowClick(row)}
                                        >
                                            <TableCell>{(currentPage - 1) * rowsPerPage + rowIndex + 1}</TableCell>
                                            {headers.map((header, colIndex) => (
                                                <TableCell key={colIndex}>
                                                    {
                                                        typeof row[header] === "number"
                                                            ? row[header].toFixed(2)
                                                            : row[header]
                                                    }
                                                    {/* {row[header] ?? "-"} */}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
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
                    </>
                )
            }
        </>
    );
});

export default StockTable;
