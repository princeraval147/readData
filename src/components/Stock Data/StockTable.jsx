import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Pagination, Box, CircularProgress
} from '@mui/material';


const StockTable = React.memo(({ stocks, onRowClick }) => {
    const [loading, setLoading] = useState(false); // Show loader if needed (can be controlled externally)
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    // Headers based on first item keys
    const headers = stocks.length > 0 ? Object.keys(stocks[0]) : [];

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

    return (
        <>
            {loading ? (
                <Box textAlign="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 480, overflow: 'auto' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {headers.map((header, i) => (
                                    <TableCell
                                        key={i}
                                        sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}
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
                                    {headers.map((header, colIndex) => (
                                        <TableCell key={colIndex}>
                                            {row[header]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            {stocks.length !== 0 && (
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
            )}
        </>
    );
});

export default StockTable;
