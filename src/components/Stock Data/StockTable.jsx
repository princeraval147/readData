import React, { useState, useMemo, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, Box
} from '@mui/material';


const StockTable = React.memo(({ stocks, onRowClick, showAllColumns = false }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    const headersToShow = [
        "ID", "KAPAN", "PACKET", "TAG", "STOCKID", "WEIGHT",
        "SHAPE", "COLOR", "CLARITY", "CUT", "POLISH", "SYMMETRY", "FLUORESCENCE",
        "LENGTH", "WIDTH", "HEIGHT", "SHADE", "MILKY", "EYE_CLEAN",
        "LAB", "CERTIFICATE_COMMENT", "CITY", "STATE", "COUNTRY",
        "DEPTH_PERCENT", "TABLE_PERCENT", "DIAMOND_VIDEO", "DIAMOND_IMAGE",
        "RAP_PER_CARAT", "PRICE_PER_CARAT", "RAP_PRICE", "DOLLAR_RATE", "RS_AMOUNT", "DISCOUNT", "FINAL_PRICE",
        "GROWTH_TYPE", "LW_RATIO", "CULET_SIZE", "CERTIFICATE_IMAGE", "STATUS", "DIAMOND_TYPE", "IS_ACTIVE",
        "BGM", "NO_BGM", "CERTIFICATE_NUMBER", "PARTY", "DUE"
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
        if (stocks.length > 0) {
            const missingHeaders = headersToShow.filter(h => !Object.keys(stocks[0]).includes(h));
            if (missingHeaders.length > 0) {
                console.log("Missing headers in data:", missingHeaders);
            }
        }
    }, [stocks]);






    return (
        <>
            {/* <TableContainer component={Paper} sx={{ maxHeight: 480, overflow: 'auto' }}> */}
            {
                stocks.length !== 0 &&
                (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            position: 'sticky',
                                            top: 0,
                                            background: '#f0f0f0',
                                            zIndex: 1
                                        }}>
                                        {headers.map((header, i) => (
                                            <TableCell
                                                key={i}
                                                sx={{
                                                    backgroundColor: '#f0f0f0',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {header}
                                            </TableCell>
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
                                                    {/* {row[header]} */}
                                                    {row[header] ?? "-"}
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
