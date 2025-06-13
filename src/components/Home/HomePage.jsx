import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';

const HomePage = () => {
    return (
        <Box sx={{ p: 4 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    p: 5,
                    textAlign: 'center',
                    mb: 4,
                }}
            >
                <Typography variant="h3" gutterBottom fontWeight="bold">
                    Welcome to Diamond Portal
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    Manage your diamond inventory and share APIs effortlessly.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        component={NavLink}
                        to="/stock-data"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: '30px',
                            background: 'linear-gradient(to right, #007bff, #0056b3)',
                            boxShadow: '0px 4px 12px rgba(0, 123, 255, 0.4)',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                background: 'linear-gradient(to right, #0056b3, #003f7f)',
                            }
                        }}
                    >
                        View Stock
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        component={NavLink}
                        to="/share-api"
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: '30px',
                            borderColor: '#007bff',
                            color: '#007bff',
                            fontWeight: 500,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#007bff',
                                color: '#fff',
                                transform: 'translateY(-2px)',
                                borderColor: '#0056b3'
                            }
                        }}
                    >
                        Share API
                    </Button>
                </Box>
            </Box>

            {/* Features Section */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            💎 Stock Management
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Upload, filter, and manage your diamond inventory with precision. Our advanced tools
                            let you control weight, shape, clarity, and more.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            🌐 API Sharing
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Seamlessly share diamond data through secure API endpoints. Perfect for B2B
                            integration and automated inventory access.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;
