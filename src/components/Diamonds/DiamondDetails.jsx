import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import API from '../../API';

const DiamondDetails = () => {
    const { id } = useParams();
    const [diamond, setDiamond] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiamond = async () => {
            try {
                const res = await API.get(`/diamond/${id}`);
                setDiamond(res.data);
                console.log("Details of diamond = ", res.data);
            } catch (err) {
                console.error("Failed to fetch diamond", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiamond();
    }, [id]);

    if (loading) return <CircularProgress />;

    if (!diamond) return <Typography>No diamond found.</Typography>;

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} mb={4}>
                {diamond.SHAPE} – {diamond.WEIGHT} ct
            </Typography>
            <Box display="flex" gap={4} flexDirection={{ xs: 'column', md: 'row' }}>
                <Box sx={{ flex: 1 }}>
                    <img
                        src={diamond.DIAMOND_IMAGE}
                        alt={diamond.SHAPE}
                        style={{ maxWidth: '100%', objectFit: 'contain' }}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography>Color: {diamond.COLOR.toUpperCase() || diamond.FANCY_COLOR.toUpperCase()}</Typography>
                    <Typography>Clarity: {diamond.CLARITY.toUpperCase()}</Typography>
                    <Typography>Lab: {diamond.LAB.toUpperCase()}</Typography>
                    <Typography>Fluorescence: {diamond.FLUORESCENCE.toUpperCase()}</Typography>
                    <Typography>Price: ${diamond.PRICE_PER_CARAT?.toLocaleString()}</Typography>
                    <Typography>Certificate No: {diamond.CERTIFICATE_NUMBER}</Typography>
                    <Typography>Party : {diamond.party_name}</Typography>
                    <Typography>Contact : {diamond.party_contact || "Not Available"}</Typography>
                    <Typography>Email : {diamond.party_email}</Typography>
                    {/* Add more fields as needed */}
                </Box>
            </Box>
        </Container>
    );
};

export default DiamondDetails;
