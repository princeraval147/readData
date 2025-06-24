import React from 'react';
import { Box, Typography, Button, Grid, Paper, Stack } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { FaGem, FaChartBar, FaCubes, FaShareAlt } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, to, variant = "contained" }) => (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center', height: '100%' }}>
        <Box sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>{icon}</Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
        </Typography>
        <Button
            component={NavLink}
            to={to}
            variant={variant}
            size="small"
            sx={{
                px: 3,
                borderRadius: '20px',
                textTransform: 'none',
                ...(variant === 'outlined' && {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                        color: '#fff'
                    }
                })
            }}
        >
            Go to {title}
        </Button>
    </Paper>
);

const HomePage = () => {
    return (
        <Box sx={{ p: { xs: 2, md: 6 }, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(to right, #007bff, #00c6ff)',
                    borderRadius: 4,
                    p: { xs: 4, md: 8 },
                    color: '#fff',
                    textAlign: 'center',
                    mb: 6,
                    boxShadow: 3,
                }}
            >
                <FaGem size={40} />
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                    Diamond Inventory Portal
                </Typography>
                <Typography variant="h6" color="inherit" sx={{ mb: 3 }}>
                    Seamlessly manage, analyze and share your diamond stock.
                </Typography>
                <Stack direction="row" justifyContent="center" spacing={2} sx={{ flexWrap: 'wrap', mt: 2 }}>
                    <Button
                        component={NavLink}
                        to="/stock-data"
                        variant="contained"
                        color="secondary"
                        sx={{
                            px: 4, py: 1.5, borderRadius: '30px', fontWeight: 500,
                            '&:hover': { backgroundColor: '#5a32a3' }
                        }}
                    >
                        View Stock
                    </Button>
                    <Button
                        component={NavLink}
                        to="/reports"
                        variant="outlined"
                        sx={{
                            px: 4, py: 1.5, borderRadius: '30px', fontWeight: 500,
                            borderColor: '#fff', color: '#fff',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        View Reports
                    </Button>
                    <Button
                        component={NavLink}
                        to="/share-api"
                        variant="outlined"
                        sx={{
                            px: 4, py: 1.5, borderRadius: '30px', fontWeight: 500,
                            borderColor: '#fff', color: '#fff',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        Share API
                    </Button>
                </Stack>
            </Box>

            {/* Features Section */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<FaCubes />}
                        title="Stock Management"
                        description="Upload, filter, and manage your diamond inventory by shape, clarity, weight and more."
                        to="/stock-data"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<FaChartBar />}
                        title="Reports"
                        description="Analyze hold vs. sold stock with filters and export capabilities."
                        to="/reports"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<FaShareAlt />}
                        title="API Integration"
                        description="Securely share your diamond data with clients or partners using our API tools."
                        to="/share-api"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;
