import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Avatar, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {

    const testimonials = [
        {
            name: "Raj Mehta",
            company: "Mehta Diamonds",
            feedback: "Sharing our API securely with clients has never been easier. Platinum Tech simplified our workflow.",
            image: "/Imgs/img1.jpg", // store in public folder
        },
        {
            name: "Nisha Patel",
            company: "Sparkle Gems",
            feedback: "Love the tracking and email integration — fast, reliable, and professional.",
            image: "/Imgs/person2.jpg",
        },
    ];

    const clientLogos = [
        "/Imgs/NK.ico",
        "/Imgs/lkd.jpg",
        "/Imgs/Vihan.ico",
        "/Imgs/shree.ico",
    ];


    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                    <Typography variant="h3" gutterBottom color="primary">
                        Welcome to Platinum API Portal
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Share your diamond stock securely and manage access with ease.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        to="/share-api"
                        sx={{ px: 4 }}
                    >
                        Share Your API
                    </Button>
                </Paper>

                <Grid container spacing={4} sx={{ mt: 6 }}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                🔐 Secure Sharing
                            </Typography>
                            <Typography variant="body1">
                                Share your private API endpoint and token securely with email-based delivery and access tracking.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                📊 Access History
                            </Typography>
                            <Typography variant="body1">
                                Monitor who you’ve shared your API with, and view access history any time.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Typography variant="h5" textAlign="center" mt={8} gutterBottom>
                What Our Clients Say
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {testimonials.map((t, i) => (
                    <Grid item xs={12} md={6} key={i}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar src={t.image} alt={t.name} sx={{ mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">{t.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{t.company}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1" color="text.primary">
                                    “{t.feedback}”
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" textAlign="center" mt={10} gutterBottom>
                Trusted By Industry Leaders
            </Typography>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {clientLogos.map((logo, i) => (
                    <Grid item xs={6} md={3} key={i} textAlign="center">
                        <img src={logo} alt={`Client ${i}`} style={{ maxWidth: '100px', maxHeight: '60px' }} />
                    </Grid>
                ))}
            </Grid>


        </Box>
    );
};

export default HomePage;
